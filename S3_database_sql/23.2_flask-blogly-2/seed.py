"""Seed file to make sample data for users db."""

from models import User, Post, db
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

db.session.add_all([john, mike, steve])
db.session.commit()

p1 = Post(title='Welcome to my mine',
          content='We are mining diamonds', user_id=3)
p2 = Post(title="We don't have to strip mine",
          content="We don't have to fight mobs", user_id=2)
p3 = Post(title='Play that noteblock nicely',
          content="Show me all those emeralds", user_id=3)


db.session.add_all([p1, p2, p3])
db.session.commit()
