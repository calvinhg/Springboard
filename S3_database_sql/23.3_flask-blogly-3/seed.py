"""Seed file to make sample data for users db."""

from models import User, Post, Tag, PostTag, db
from app import app

# Create all tables
db.drop_all()
db.create_all()

# If table isn't empty, empty it
User.query.delete()
Post.query.delete()
Tag.query.delete()
PostTag.query.delete()

# Add users
john = User(first_name='John', last_name='Deere')
mike = User(first_name='Michael', last_name='Bummer',
            img_url='https://picsum.photos/id/241/200')
steve = User(first_name='Steve', last_name='Hope',
             img_url='https://picsum.photos/id/236/200')

db.session.add_all([john, mike, steve])
db.session.commit()

# Add Posts
p1 = Post(title='Welcome to my mine',
          content='We are mining diamonds', user_id=3)
p2 = Post(title="We don't have to strip mine",
          content="We don't have to fight mobs", user_id=2)
p3 = Post(title='Play that noteblock nicely',
          content="Show me all those emeralds", user_id=3)

db.session.add_all([p1, p2, p3])
db.session.commit()

# Add Tags
t1 = Tag(name='Funny')
t2 = Tag(name='Wow')
t3 = Tag(name='Cool')
t4 = Tag(name='Meta')

db.session.add_all([t1, t2, t3, t4])
db.session.commit()

# Add posts_tags
pt1 = PostTag(post_id=1, tag_id=2)
pt2 = PostTag(post_id=2, tag_id=2)
pt3 = PostTag(post_id=2, tag_id=3)
pt4 = PostTag(post_id=3, tag_id=4)

db.session.add_all([pt1, pt2, pt3, pt4])
db.session.commit()
