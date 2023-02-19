'''Message model tests.'''

'''Run tests with
python -m unittest -v test_message_model.py'''


import os
from unittest import TestCase
from models import db, User, Message, datetime
os.environ['DATABASE_URL'] = "postgresql:///warbler-test"
os.environ['FLASK_ENV'] = 'production'

from app import app  # nopep8

db.create_all()


class MessageModelTestCase(TestCase):
    '''Test instances of Message'''

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Message.query.delete()

        self.u = User(email="test@test.com",
                      username="testuser",
                      password="HASHED_PASSWORD")
        db.session.add(self.u)
        db.session.commit()

    def test_message_model(self):
        '''Does basic model work?'''

        m = Message(text='test', user_id=self.u.id)
        db.session.add(m)
        db.session.commit()

        self.assertIsInstance(m.timestamp, datetime)
        self.assertEqual(m.user, self.u)

    def test_message_repr(self):
        '''Does __repr__ return valid string?'''

        m = Message(text='test', user_id=self.u.id)
        db.session.add(m)
        db.session.commit()

        self.assertEqual(
            m.__repr__(), f'<Message #{m.id} by user {self.u.id}>')
