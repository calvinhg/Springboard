from unittest import TestCase
from app import app
from models import User, db

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
        db.session.commit()

        self.u1 = user1
        self.u2 = user2

    def tearDown(self) -> None:
        """Clean up table"""
        db.session.rollback()

    def test_root(self):
        """/ path shows list of posts"""
        with app.test_client() as client:
            res = client.get('/')

        # self.assertEqual(res.status_code, 302)
        # self.assertIn('/users', res.location)

    def test_users(self):
        """/users shows user list"""
        with app.test_client() as client:
            res = client.get('/users')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn(
            f'<a href="/users/{self.u1.id}">John Doe</a>', html)
        self.assertIn(
            f'<a href="/users/{self.u2.id}">Steve Hope</a>', html)

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
            res1 = client.get(f'/users/{self.u1.id}')
            res2 = client.get(f'/users/{self.u2.id}')
        html1 = res1.get_data(as_text=True)
        html2 = res2.get_data(as_text=True)

        self.assertEqual(res1.status_code, 200)
        self.assertIn('/id/137/200" alt="John Doe"', html1)
        self.assertIn('/id/236/200" alt="Steve Hope"', html2)

    def test_user_edit_form(self):
        """/users/<id>/edit shows form to edit user"""
        with app.test_client() as client:
            res = client.get(f'/users/{self.u1.id}/edit')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn('value="Doe"', html)


class BloglyModelsTestCase(TestCase):
    """Blogly models tests"""

    def setUp(self) -> None:
        """Remove any existing users"""
        User.query.delete()
        self.test_user = User(first_name='First', last_name='Last')

    def tearDown(self) -> None:
        """Revert any changes"""
        db.session.rollback()

    def test_user_create(self):
        """Adding user to db adds image if none"""
        db.session.add(self.test_user)
        db.session.commit()

        self.assertIn('/id/137/200', self.test_user.img_url)

    def test_repr(self):
        """Shows user details"""
        self.assertEqual(self.test_user.__repr__(),
                         '<User None: First Last>')

    def test_get_name(self):
        """user.get_name() returns full name"""
        self.assertEqual(self.test_user.get_name(), 'First Last')
