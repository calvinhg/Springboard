from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)


class Pet(db.Model):
    '''Pet Model with columns:
    ```sql
    id SERIAL PK,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    photo_url TEXT,
    age INT,
    notes TEXT,
    available BOOL NOT NULL DEFAULT TRUE;
    ```'''

    __tablename__ = 'pets'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False)
    species = db.Column(db.Text, nullable=False)
    photo_url = db.Column(db.Text, nullable=False, default='/static/pet.png')
    age = db.Column(db.Integer)
    notes = db.Column(db.Text)
    available = db.Column(db.Boolean, nullable=False, default=True)

    def __repr__(self) -> str:
        return f'<Pet {self.id}: {self.name}>'
