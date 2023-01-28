from unittest import TestCase
from app import app
from models import User, Post, db

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_test'
app.config['SQLALCHEMY_ECHO'] = False

app.config['TESTING'] = True

db.drop_all()
db.create_all()


class BloglyUserTestCase(TestCase):
    """Flask app tests"""

    def setUp(self) -> None:
        """Empty table, add placeholders"""
        User.query.delete()
        user1 = User(first_name='John', last_name='Doe')
        user2 = User(first_name='Steve', last_name='Hope',
                     img_url='https://picsum.photos/id/236/200')
        db.session.add_all([user1, user2])

        Post.query.delete()
        post1 = Post(title='post1 title',
                     content='post1 content', user_id=user1.id)
        post2 = Post(title='post2 title',
                     content='post2 content', user_id=user2.id)
        db.session.add_all([post1, post2])

        db.session.commit()

        self.u1 = user1
        self.u2 = user2
        self.p1 = post1
        self.p2 = post2

    def tearDown(self) -> None:
        """Clean up table"""
        db.session.rollback()

    def test_root(self):
        """/ path shows list of posts"""
        with app.test_client() as client:
            res = client.get('/')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<h3>post1 title</h3>', html)
        self.assertIn('<h3>post2 title</h3>', html)
        self.assertIn('by Steve Hope', html)

    def test_users(self):
        """/users shows user list"""
        with app.test_client() as client:
            res = client.get('/users')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn(
            f'<a href="/users/{self.u1.id}">John Doe</a></li>', html)
        self.assertIn(
            f'<a href="/users/{self.u2.id}">Steve Hope</a></li>', html)

    def test_user_add_form(self):
        """/users/new shows form to add user"""
        with app.test_client() as client:
            res = client.get('/users/new')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<label for="first_name">First name</label>', html)

    def test_user_add(self):
        """/users/new [POST] adds user to db"""
        with app.test_client() as client:
            d = {'first_name': 'Test_first',
                 'last_name': 'Test_last', 'img_url': ''}
            res = client.post('/users/new', data=d, follow_redirects=True)
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('>Test_first Test_last</a>', html)

    def test_user_details(self):
        """/users/<id> shows user details"""
        with app.test_client() as client:
            res = client.get(f'/users/{self.u1.id}')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('/id/137/200" alt="John Doe"', html)
        self.assertIn(f'"/posts/{self.p1.id}">post1 title</a>', html)

    def test_user_edit(self):
        """/users/<id>/edit [POST] edits user, redirs to details"""
        with app.test_client() as client:
            d = {'first_name': 'NotJohn', 'last_name': '', 'img_url': ''}
            res = client.post(
                f'/users/{self.u1.id}/edit', data=d, follow_redirects=True)
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<h2>NotJohn Doe</h2>', html)

    def test_user_delete(self):
        """/users/<id>/delete [POST] deletes user, redirs to user list"""
        with app.test_client() as client:
            res = client.post(
                f'/users/{self.u1.id}/delete', follow_redirects=True)
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertNotIn('John Doe</a></li>', html)

    def test_post_redir(self):
        '''/posts redirects to / root'''
        with app.test_client() as client:
            res = client.get('/posts')

        self.assertEqual(res.status_code, 302)
        self.assertEqual('http://localhost/', res.location)

    def test_post_details(self):
        '''/posts/<id> shows post details'''
        with app.test_client() as client:
            res = client.get(f'/posts/{self.p2.id}')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<p>post2 content</p', html)
        self.assertIn('Steve Hope</a>', html)
        self.assertIn(f'on {self.p2.human_date}', html)

    def test_post_edit(self):
        '''/posts/<id>/edit [POST] edits post, redirs to post'''
        with app.test_client() as client:
            d = {'title': 'title1', 'content': 'content1'}
            res = client.post(
                f'/posts/{self.p1.id}/edit', data=d, follow_redirects=True)
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('<p>content1</p>', html)


class BloglyModelsTestCase(TestCase):
    """Blogly models tests"""

    def setUp(self) -> None:
        """Remove any existing users"""
        User.query.delete()
        Post.query.delete()

        self.test_user = User(first_name='First', last_name='Last')
        self.test_post = Post(title='post title',
                              content='post content', user_id=1)

    def tearDown(self) -> None:
        """Revert any changes"""
        db.session.rollback()

    def test_user_create(self):
        """Adding user to db adds image if none"""
        db.session.add(self.test_user)
        db.session.commit()

        self.assertIn('/id/137/200', self.test_user.img_url)

    def test_user_repr(self):
        """Shows user details"""
        self.assertEqual(self.test_user.__repr__(),
                         '<User None: First Last>')

    def test_user_get_name(self):
        """user.full_name returns full name"""
        self.assertEqual(self.test_user.full_name, 'First Last')

    def test_post_create(self):
        '''Adding post to db works, after which date props available'''
        db.session.add_all([self.test_user, self.test_post])
        db.session.commit()

        self.assertTrue(self.test_post.created_at)
        self.assertTrue(self.test_post.human_date)
