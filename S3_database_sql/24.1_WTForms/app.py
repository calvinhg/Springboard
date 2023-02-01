from flask import Flask, render_template, flash, redirect, render_template
from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, Pet
from forms import PetForm

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///pet_shop"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

debug = DebugToolbarExtension(app)

connect_db(app)


@app.errorhandler(404)
def not_found(e):
    '''Show error page'''
    return render_template('404.html')


@app.route('/<int:id>/reserve')
def reserve_pet(id):
    '''"Reserve" a pet -O.O-'''
    return render_template('reserve_pet.html')


@app.route('/')
def home_page():
    '''Show home page with list of pets'''
    return render_template('home.html', pets=Pet.query.all())


@app.route('/add', methods=['GET', 'POST'])
def add_pet():
    '''GET: Show form to add pet
    POST: Save pet and redirect to home'''
    form = PetForm()

    if form.validate_on_submit():

        name = form.name.data
        species = form.species.data
        photo_url = form.photo_url.data
        age = form.age.data
        notes = form.notes.data
        available = form.available.data
        # Change to None if empty string
        photo_url = photo_url if photo_url else None

        pet = Pet(name=name, species=species, photo_url=photo_url,
                  age=age, notes=notes, available=available)

        db.session.add(pet)
        db.session.commit()
        return redirect('/')
    else:
        return render_template('pet_form.html', form=form)


@app.route('/<int:id>', methods=['GET', 'POST'])
def pet_details(id):
    '''GET: Show pet details and form to edit
    POST: Save changes and redirect to GET'''
    pet = Pet.query.get_or_404(id)
    form = PetForm(obj=pet)

    if form.validate_on_submit():
        photo_url = form.photo_url.data
        pet.notes = form.notes.data
        pet.available = form.available.data
        # Set to default if empty string
        pet.photo_url = photo_url if photo_url else '/static/pet.png'

        db.session.add(pet)
        db.session.commit()
        return redirect(f'/{id}')
    else:
        return render_template('pet_details.html', pet=pet, form=form)
