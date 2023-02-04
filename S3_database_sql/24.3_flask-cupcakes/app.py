"""Flask app for Cupcakes"""
from flask import Flask, request, jsonify, render_template
import requests
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcake'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "cupcake"

connect_db(app)


@app.route('/')
def home():
    '''Show home page. Populated by JS event listener.'''
    return render_template('home.html')


@app.route('/api/cupcakes')
def list_cupcakes():
    '''Returns list of cupcakes as json'''
    all_cupcakes = Cupcake.query.all()
    return jsonify(cupcakes=[cupcake.to_dict() for cupcake in all_cupcakes])


@app.route('/api/cupcakes/<int:id>')
def cupcake_details(id):
    '''Returns details of cupcake[id] as json'''
    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.to_dict())


@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
    '''Validates submitted data, adds cupcake to db
    and returns details as json'''

    is_invalid = check_invalid_data(request.json)
    if is_invalid['result']:
        return (jsonify(error=make_error(is_invalid)), 400)

    cupcake = make_cupcake(request.json)

    db.session.add(cupcake)
    db.session.commit()

    return (jsonify(cupcake=cupcake.to_dict()), 201)


@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def update_cupcake(id):
    '''Change data for cupcake if different,
    returns details as json'''
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
    '''Removes from db and returns id of deleted'''
    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(deleted=cupcake.id)


'''**************************************************
              FUNCTIONS FOR POST METHOD
Validates data, makes error json, and creates cupcake
**************************************************'''


def make_cupcake(json):
    '''Gets data from json and returns Cupcake instance'''
    flavor = json.get('flavor')
    frosting = json.get('frosting')
    size = json.get('size')
    rating = json.get('rating')
    image = json.get('image')

    # Set to None if empty string
    frosting = frosting if frosting else None
    image = image if image else None

    return Cupcake(flavor=flavor, frosting=frosting,
                   size=size, rating=rating, image=image)


def check_invalid_data(json):
    '''Checks for invalid data submissions: \n
    - missing non-nullable parameters \n
    - non-float rating \n
    - invalid image url \n
    Returns dict `{'result': <true_or_false>,
    'error': <error>, 'param': <missing_param>}`'''

    # Checks for "" or None
    for param in ('flavor', 'size', 'rating'):
        if not json.get(param):
            return {'result': True, 'error': 'missing', 'param': param}

    # Checks if is a float
    if not str(json['rating']).replace('.', '', 1).isdigit():
        return {'result': True, 'error': 'invalid rating', 'param': json['rating']}

    # Skips if "" or None
    if json.get('image'):
        if is_not_url_image(json.get('image')):
            return {'result': True, 'error': 'invalid image', 'param': json['image']}

    return {'result': False, 'error': None, 'param': None}


def make_error(invalid_data):
    '''Makes error body as dict'''
    error = invalid_data['error']
    param = invalid_data['param']

    if error == 'missing':
        err_code = 'POST_MISSING_DATA'
        err_message = 'POST request missing parameter'
        err_details = f'Please make sure to include flavor, size and rating (missing: {param})'

    elif error == 'invalid rating':
        err_code = 'POST_INVALID_RATING'
        err_message = 'POST request with invalid parameter rating'
        err_details = f'Please include rating of type int or float (rating = {param})'

    elif error == 'invalid image':
        err_code = 'POST_INVALID_IMAGE'
        err_message = 'POST request with invalid image link'
        err_details = f'Please submit a valid image URL (image = {param})'

    return {'err_code': err_code, 'err_message': err_message, 'err_details': err_details}


def is_not_url_image(image_url):
    '''Checks if is image and responds when pinged'''
    try:
        image_formats = ("image/png", "image/jpeg", "image/jpg")
        r = requests.head(image_url)
        if r.headers["content-type"] in image_formats:
            return False
        return True
    except:
        return True
