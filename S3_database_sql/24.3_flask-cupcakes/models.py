"""Models for Cupcake app."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_db(app):
    db.app = app
    db.init_app(app)


class Cupcake(db.Model):
    '''Cupcake Model with columns:
    ```sql
    id SERIAL PK
    flavor TEXT NOT NULL,
    frosting TEXT,
    size TEXT NOT NULL,
    rating FLOAT NOT NULL,
    image TEXT NOT NULL DEFAULT 'https://picsum.photos/550/825'
    ```'''

    __tablename__ = 'cupcakes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.Text, nullable=False)
    frosting = db.Column(db.Text)
    size = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    image = db.Column(db.Text, nullable=False,
                      default='https://picsum.photos/550/825')

    def __repr__(self) -> str:
        return f'<Cupcake {self.id}: {self.flavor} with {self.frosting} Frosting>'

    def to_dict(self) -> dict:
        return {'id': self.id,
                'flavor': self.flavor,
                'frosting': self.frosting,
                'size': self.size,
                'rating': self.rating,
                'image': self.image}
