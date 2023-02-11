from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()

bcrypt = Bcrypt()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)


class User(db.Model):
    '''User Model with columns
    ```sql
    id SERIAL PK,
    username TEXT NOT NULL UNIQUE,
    pass_hash TEXT NOT NULL,
    email VARCHAR(50) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL
    ```'''
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.Text, nullable=False, unique=True)
    pass_hash = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(50), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)

    @classmethod
    def register(cls, u_name, pwd, email, f_name, l_name):
        '''Returns new user with hashed pwd'''
        hashed = bcrypt.generate_password_hash(pwd)
        hashed_utf8 = hashed.decode('utf8')

        return cls(username=u_name,
                   pass_hash=hashed_utf8,
                   email=email,
                   first_name=f_name,
                   last_name=l_name)

    @classmethod
    def auth(cls, username, pwd):
        '''Returns user if valid username + pass, else False'''
        u = cls.query.filter_by(username=username).first()
        if u and bcrypt.check_password_hash(u.pass_hash, pwd):
            return u
        else:
            return False


class Feedback(db.Model):
    '''Feedback Model with columns:
    ```sql
    id SERIAL PK,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    username TEXT NOT NULL FK REFS users.username
    ```'''
    __tablename__ = 'feedbacks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.Text, db.ForeignKey(
        'users.username', ondelete='CASCADE'), nullable=False)

    user = db.relationship('User', backref='feedbacks')
