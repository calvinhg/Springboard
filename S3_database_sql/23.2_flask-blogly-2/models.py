"""Models for Blogly."""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import backref

db = SQLAlchemy()


def connect_db(app):
    db.app = app
    db.init_app(app)
    # db.create_all()


class User(db.Model):
    '''User Model with columns:
    ```id SERIAL PK,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    img_url TEXT NOT NULL DEFAULT=<stock img>
    ```
    Linked to Post by User.id = Post.user_id'''

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    img_url = db.Column(db.Text, nullable=False,
                        default='https://picsum.photos/id/137/200')

    def __repr__(self) -> str:
        return f'<User {self.id}: {self.first_name} {self.last_name}>'

    def get_name(self) -> str:
        return f'{self.first_name} {self.last_name}'

    full_name = property(get_name)


class Post(db.Model):
    """Post Model with columns:
    ```id SERIAL PK,
    user_id INT FK REFS users.id NOT NULL,
    title VARCHAR(50) NOT NULL,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT=<current time>
    ```
    Linked to User by User.id = Post.user_id"""

    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.now())

    user = db.relationship('User', backref='posts')

    def __repr__(self) -> str:
        '''Show desc of post with id + title'''
        return f'<Post {self.id}: {self.title} created at {self.human_date}>'

    def get_human_date(self) -> str:
        '''Returns more pleasant date, accessible with
        property `self.human_date`'''
        d = self.created_at
        return f"{d.ctime()[:7]} {d.day} {d.year}, {d.hour}:{d.minute}"

    human_date = property(get_human_date)
