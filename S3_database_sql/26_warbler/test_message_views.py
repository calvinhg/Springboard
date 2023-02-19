"""Message View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_views.py


import os
from unittest import TestCase

from models import db, Message, User

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"
os.environ['FLASK_ENV'] = 'production'


# Now we can import app

from app import app, CURR_USER_KEY  # nopep8

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.create_all()

# Don't have WTForms use CSRF at all, since it's a pain to test

app.config['WTF_CSRF_ENABLED'] = False


class MessageViewTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Message.query.delete()

        self.client = app.test_client()

        self.testuser = User.signup("testuser", "test@test.com",
                                    "testuser", None)

        db.session.commit()

    def test_add_message(self):
        """Does /messages/new [POST] add a message?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            # Now, that session setting is saved, so we can have
            # the rest of our test

            res = c.post("/messages/new", data={"text": "Hello"})

        # Make sure it redirects
        self.assertEqual(res.status_code, 302)
        self.assertIn(f'/users/{self.testuser.id}', res.location)

        msg = Message.query.one()
        self.assertEqual(msg.text, "Hello")

    def test_show_message(self):
        '''Show message details'''

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            c.post('/messages/new', data={'text': 'testpost'})
            msg = Message.query.one()
            res = c.get(f'/messages/{msg.id}')

        html = res.get_data(as_text=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn('<p class="single-message">testpost</p>', html)

    def test_add_msg_redirect(self):
        '''Does /messages/new [POST] show message?'''
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            res = c.post('/messages/new',
                         data={'text': 'TestMsg'}, follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<p>TestMsg</p>', html)

    def test_del_msg(self):
        '''Does /messages/<id>/delete [POST] delete the message?'''
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id
            c.post('/messages/new', data={'text': 'TestMsg'})

            msg = Message.query.one()
            res = c.post(f'/messages/{msg.id}/delete')

        self.assertEqual(res.status_code, 302)
        self.assertEqual(len(Message.query.all()), 0)

    def test_del_msg_403(self):
        '''Can you delete another user's message?'''
        msg = Message(text='testmessage', user_id=self.testuser.id)

        u2 = User.signup('user2', 'test2@test.com', 'pass2', None)
        db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = u2.id

            db.session.add(msg)
            db.session.commit()
            res = c.post(f'/messages/{msg.id}/delete', follow_redirects=False)

        self.assertEqual(len(Message.query.all()), 1)
        self.assertEqual(res.status_code, 403)

    def test_add_or_del_msg_403(self):
        '''Can you add/delete a message if not logged in?'''
        with self.client as c:
            res = c.post('/messages/new',
                         data={'text': 'TestMsg'}, follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('alert-danger">Access unauthorized.</div>', html)

            res = c.post('/messages/1/delete', follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('alert-danger">Access unauthorized.</div>', html)
