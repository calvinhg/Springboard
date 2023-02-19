"""User model tests."""

# run these tests like:
#
#    python -m unittest -v test_user_model.py


import os
from unittest import TestCase

from models import db, User, Message, Follows

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"
os.environ['FLASK_ENV'] = 'production'


# Now we can import app

from app import app, IntegrityError  # nopep8

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.create_all()


class UserModelTestCase(TestCase):
    """Test instances of User"""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Message.query.delete()
        Follows.query.delete()

    def test_user_model(self):
        """Does basic model work?"""

        u = User(email="test@test.com",
                 username="testuser",
                 password="HASHED_PASSWORD")

        db.session.add(u)
        db.session.commit()

        # User should have no messages & no followers
        self.assertEqual(len(u.messages), 0)
        self.assertEqual(len(u.followers), 0)

    def test_user_repr(self):
        '''Does __repr__ return valid string?'''

        u = User(email="test@test.com",
                 username="testuser",
                 password="HASHED_PASSWORD")
        db.session.add(u)
        db.session.commit()

        self.assertEqual(
            u.__repr__(), f'<User #{u.id}: testuser, test@test.com>')

    def test_follow_fns(self):
        '''Do both is_follow... functions work?'''

        u1 = User(email="test@test.com",
                  username="testuser",
                  password="HASHED_PASSWORD")
        u2 = User(email="test2@test.com",
                  username="testuser2",
                  password="HASHED_PASSWORD2")

        self.assertFalse(u1.is_followed_by(u2))
        self.assertFalse(u2.is_following(u1))

        u1.followers.append(u2)
        db.session.add_all([u1, u2])
        db.session.commit()

        self.assertTrue(u1.is_followed_by(u2))
        self.assertTrue(u2.is_following(u1))

    def test_signup(self):
        '''Does User.signup add and return new user?'''

        u = User.signup('testuser', 'test@test.com',
                        'testpass', 'testimage.url')

        self.assertEqual(u.username, 'testuser')
        self.assertEqual(u.email, 'test@test.com')
        self.assertEqual(u.image_url, 'testimage.url')

    def test_signup_invalid(self):
        '''Does User.signup add and return new user or fail if conflict?'''

        u1 = User.signup('testuser', 'test@test.com',
                         'testpass', 'testimage.url')

        self.assertEqual(u1.username, 'testuser')
        self.assertEqual(u1.email, 'test@test.com')
        self.assertEqual(u1.image_url, 'testimage.url')

        db.session.commit()

        User.signup('testuser', 'test@test.com',
                    'testpass', 'testimage.url')
        self.assertRaises(IntegrityError, db.session.commit)
        db.session.rollback()

    def test_authenticate(self):
        '''Does User.authenticate return user or False?'''

        u = User.signup('testuser', 'test@test.com',
                        'testpass', 'testimage.url')

        self.assertEqual(u, User.authenticate('testuser', 'testpass'))
        self.assertFalse(User.authenticate('testuser', 'wrong'))
        self.assertFalse(User.authenticate('wrong', 'testpass'))
