"""Seed file to make sample data for users db."""

from models import User, db
from app import app

# Create all tables
db.drop_all()
db.create_all()

# If table isn't empty, empty it
User.query.delete()

# Add users
john = User(first_name='John', last_name='Deere')
mike = User(first_name='Michael', last_name='Bummer',
            img_url='https://picsum.photos/id/241/200')
steve = User(first_name='Steve', last_name='Hope',
             img_url='https://picsum.photos/id/236/200')

# Add new objects to session, so they'll persist
db.session.add_all([john, mike, steve])

# Commit--otherwise, this never gets saved!
db.session.commit()
