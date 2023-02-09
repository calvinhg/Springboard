from flask import Flask, render_template, redirect, session, flash, abort
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db, db, User
from forms import RegisterForm, LoginForm
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///feedback_ex"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["SQLALCHEMY_ECHO"] = True
app.config["SECRET_KEY"] = "123avc"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

connect_db(app)
toolbar = DebugToolbarExtension(app)


@app.route('/')
def home_page():
    return redirect('/register')
    return render_template('index.html')


@app.route('/users/<string:u_name>')
def user_details(u_name):
    '''Show user details if logged in'''
    if 'user_id' not in session:
        flash('Please log in first', 'warning')
        return redirect('/login')

    u = User.query.filter_by(username=u_name).first()
    if u:
        return render_template('user_details.html', u=u)
    # If no user found, show 404
    abort(404)


@app.route('/register', methods=['GET', 'POST'])
def register():
    '''Register new user or show register form'''
    if 'user_id' in session:
        # Redirect if already logged in
        return redirect('/secret')

    form = RegisterForm()

    if form.validate_on_submit():
        # Returns false if username taken
        u = register_user(form)

        if u:
            session['user_id'] = u.id
            flash('Welcome! Here are our secrets.', 'success')
            return redirect('/secret')

        # If taken, add error and show form again
        form.u_name.errors = ['This username is already taken.']
    return render_template('register.html', form=form)


def register_user(form):
    '''Accepts validated form and adds user to DB.\n
    Returns False if username taken (IntegrityError).'''
    u_name = form.u_name.data
    password = form.password.data
    email = form.email.data
    f_name = form.f_name.data
    l_name = form.l_name.data

    u = User.register(u_name, password, email, f_name, l_name)
    db.session.add(u)
    try:
        db.session.commit()
    except IntegrityError:
        return False
    return u


@app.route('/login', methods=['GET', 'POST'])
def login():
    '''Login user or show login form'''
    if 'user_id' in session:
        return redirect('/secret')

    form = LoginForm()

    if form.validate_on_submit():
        u = login_user(form)

        if u:
            session['user_id'] = u.id
            flash('Welcome back!', 'success')
            return redirect('/secret')

        form.u_name.errors = ['Invalid username or password.']
    return render_template('login.html', form=form)


def login_user(form):
    '''Accepts validated form and returns user.\n
    Returns False if not found or invalid pass.'''
    u_name = form.u_name.data
    password = form.password.data

    u = User.auth(u_name, password)
    return u


@app.route('/logout')
def logout():
    '''Logs user out (if logged in)'''
    if 'user_id' in session:
        session.pop('user_id')
        flash('Goodbye!', 'info')
    return redirect('/')
