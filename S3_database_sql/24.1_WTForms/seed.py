from app import db
from models import Pet

db.drop_all()
db.create_all()

p1 = Pet(name='Donut', species='Seagull',
         photo_url='https://picsum.photos/id/275/200/200.jpg',
         age=2, notes='Very aggressive! Be careful.')
p2 = Pet(name='Corn Flakes', species='Bear',
         photo_url='https://picsum.photos/id/433/200/200.jpg',
         age=8, notes="Kind old bear that won't eat your face.", available=False)
p3 = Pet(name='Patches', species='Leopard',
         photo_url='https://picsum.photos/id/219/200/200.jpg',
         age=1, notes='Playful little kitty.', available=False)
p4 = Pet(name='Max', species='Dog',
         photo_url='https://picsum.photos/id/237/200/200.jpg',
         age=1, notes="Killer rabbit, except it's a dog.")
p5 = Pet(name='Bill and Bob', species='Dog',
         photo_url='https://picsum.photos/id/169/200/200.jpg',
         age=1, notes="Friendly to all babies, except humanoid ones.")
p6 = Pet(name='Nemo', species='Fish', photo_url='/static/pet.png',
         age=22, notes='Real fish.', available=False)

db.session.add_all([p1, p2, p3, p4, p5])
db.session.commit()
