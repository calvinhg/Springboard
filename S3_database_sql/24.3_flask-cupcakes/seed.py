from app import app
from models import db, Cupcake


db.drop_all()
db.create_all()

c1 = Cupcake(flavor="Cherry", size="large", rating=2)
c2 = Cupcake(flavor="Chocolate", frosting='Chocolate Cream Cheese',
             size="small", rating=9,
             image="https://g2i3m4x4.stackpathcdn.com/wp-content/uploads/2018/01/chocolatecupcakesccfrosting1_bakedbyrachel.jpg"
             )
c3 = Cupcake(flavor="Gingerbread Latte", frosting='Cream Cheese',
             size="small", rating=5,
             image="https://g2i3m4x4.stackpathcdn.com/wp-content/uploads/2020/12/gingerbreadlattecupcakes5_bakedbyrachel.jpg"
             )
c4 = Cupcake(flavor="Apple Crisp", frosting='Caramel Cream Cheese',
             size="medium", rating=8,
             image="https://g2i3m4x4.stackpathcdn.com/wp-content/uploads/2020/09/applecrispcupcakes1_bakedbyrachel.jpg"
             )
c5 = Cupcake(flavor="Chocolate Candy Cane", frosting='Peppermint Buttercream',
             size="small", rating=7,
             image="https://g2i3m4x4.stackpathcdn.com/wp-content/uploads/2017/12/chocolatepeppermintcupcakes3_bakedbyrachel.jpg"
             )

db.session.add_all([c1, c2, c3, c4, c5])
db.session.commit()
