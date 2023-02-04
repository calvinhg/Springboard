"""Flask app for Cupcakes"""
from flask import Flask, request, jsonify, render_template

from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcake'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "cupcake"

connect_db(app)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/api/cupcakes')
def list_cupcakes():
    all_cupcakes = Cupcake.query.all()
    return jsonify(cupcakes=[cupcake.to_dict() for cupcake in all_cupcakes])


@app.route('/api/cupcakes/<int:id>')
def cupcake_details(id):
    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.to_dict())


@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():

    missing_data = check_missing_data(request.json)
    if missing_data['result']:
        return (make_error(missing_data['param']), 400)

    cupcake = make_cupcake(request.json)

    db.session.add(cupcake)
    db.session.commit()

    return (jsonify(cupcake=cupcake.to_dict()), 201)


@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def update_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)

    cupcake.flavor = request.json.get('flavor', cupcake.flavor)
    cupcake.frosting = request.json.get('frosting', cupcake.frosting)
    cupcake.size = request.json.get('size', cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)

    db.session.commit()

    return jsonify(cupcake=cupcake.to_dict())


@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(deleted=cupcake.id)


'''**************************************************
              FUNCTIONS FOR POST METHOD
Validates data, makes error json, and creates cupcake
**************************************************'''


def check_missing_data(json):
    '''Checks for missing flavor, size or rating in json.\n
    Returns dict `{'result': <true_or_false>, 'param':<missing_param>}`'''
    for param in ('flavor', 'size', 'rating'):
        if json.get(param) is None:
            return {'result': True, 'param': param}

    return {'result': False, 'param': None}


def make_error(param):
    '''Makes error body to show in json format'''
    err_code = 'POST_MISSING_DATA'
    err_message = f'POST request missing parameter {param}'
    err_details = 'Please make sure to include flavor, size and rating.'

    return jsonify(err_code=err_code, err_message=err_message, err_details=err_details)


def make_cupcake(json):
    '''Makes cupcake using Model and returns it'''
    flavor = json.get('flavor')
    frosting = json.get('frosting')
    size = json.get('size')
    rating = json.get('rating')
    image = json.get('image')

    return Cupcake(flavor=flavor, frosting=frosting,
                   size=size, rating=rating, image=image)
