"""Models for Blogly."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_db(app):
    db.app = app
    db.init_app(app)
    # db.create_all()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    img_url = db.Column(db.String(), nullable=False,
                        default='https://avatars.githubusercontent.com/u/29399002')

    def __repr__(self) -> str:
        return f'<User {self.id}: {self.first_name} {self.last_name}>'

    def get_name(self) -> str:
        return f'{self.first_name} {self.last_name}'
