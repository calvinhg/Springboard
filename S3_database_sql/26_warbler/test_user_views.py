import os
from unittest import TestCase
from models import db, Message, User

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"
os.environ['FLASK_ENV'] = 'production'

from app import app, CURR_USER_KEY  # nopep8

db.create_all()

app.config['WTF_CSRF_ENABLED'] = False


class UserViewsTestCase(TestCase):
    '''Test views for users'''

    def setUp(self):
        '''Create test client, add sample users'''

        User.query.delete()
        Message.query.delete()

        self.client = app.test_client()
        self.u1 = User.signup('testuser1', 'test1@test.com', 'test1', None)
        self.u2 = User.signup('testuser2', 'test2@test.com', 'test2', None)
        self.u3 = User.signup('testuser3', 'test3@test.com', 'test3', None)
        db.session.commit()

    #######################
    # NOT LOGGED IN TESTS #

    def test_home(self):
        '''/ shows welcome page'''

        res = self.client.get('/')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('class="btn btn-primary">Sign up</a>', html)

    def test_user_list(self):
        '''/users shows user list'''

        res = self.client.get('/users')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<p>@testuser1</p>', html)
        self.assertIn('<p>@testuser2</p>', html)
        self.assertIn('<p>@testuser3</p>', html)

    def test_user_details(self):
        '''/users/<id> shows user details'''
        self.u1.messages.append(Message(text='testmsg'))

        res = self.client.get(f'/users/{self.u1.id}')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<h4 id="sidebar-username">@testuser1</h4>', html)
        self.assertIn('<p>testmsg</p>', html)

    ###################
    # LOGGED IN TESTS #

    def test_home_authd(self):
        '''/ shows list of own and following's warbles'''
        self.u1.following = [self.u2, self.u3]
        m1 = Message(text='testmessage1', user_id=self.u1.id)
        m2 = Message(text='testmessage2', user_id=self.u2.id)
        m3 = Message(text='testmessage3', user_id=self.u3.id)

        db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.u1.id
            db.session.add_all([m1, m2, m3])
            db.session.commit()

            res = c.get('/')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<p>testmessage1</p>', html)
        self.assertIn('<p>testmessage2</p>', html)
        self.assertIn('<p>testmessage3</p>', html)

    def test_user_details_authd(self):
        '''/users/<id> shows edit and delete buttons'''
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.u1.id

            res = c.get(f'/users/{self.u1.id}')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('secondary">Edit Profile</a>', html)
        self.assertIn('danger ml-2">Delete Profile</button>', html)

    def test_user_edit_get(self):
        '''/users/profile shows autofilled edit form'''
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.u1.id

            res = c.get('/users/profile')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('value="test1@test.com"', html)
        self.assertIn('value="/static/images/default-pic.png"', html)

    def test_user_edit_post(self):
        '''/users/profile [POST] edits user'''
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.u1.id

            data = {'username': 'edituser1',
                    'email': 'edit1@test.com',
                    'image_url': 'testimg.url',
                    'bio': 'this is a test bio',
                    'pwd': 'test1'}
            res = c.post('/users/profile', data=data)
        self.u1 = User.query.get(self.u1.id)

        self.assertEqual(res.status_code, 302)
        self.assertIn(f'/users/{self.u1.id}', res.location)
        self.assertEqual(self.u1.bio, 'this is a test bio')

    def test_user_delete(self):
        '''/users/delete [POST] delete user in session'''
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.u1.id

            res = c.post('/users/delete')

        self.assertEqual(res.status_code, 302)
        self.assertEqual(len(User.query.all()), 2)

    def test_followers(self):
        '''/users/<id>/followers shows followers'''
        self.u1.followers = [self.u2, self.u3]
        db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.u1.id
            res = c.get(f'/users/{self.u1.id}/followers')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<p>@testuser2</p>', html)
        self.assertIn('<p>@testuser3</p>', html)
