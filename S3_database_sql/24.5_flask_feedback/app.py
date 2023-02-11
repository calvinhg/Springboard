from flask import Flask, render_template, redirect, session, flash, abort, request
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db, db, User, Feedback
from forms import FeedbackForm, RegisterForm, LoginForm, SendEmailForm, PwdResetForm
from sqlalchemy.exc import IntegrityError
from secrets import token_urlsafe

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
    return redirect('/users')
    return render_template('index.html')


@app.route('/users')
def user_list():
    '''Show user list'''
    u_all = User.query.all()
    return render_template('user_list.html', u_all=u_all)


@app.route('/users/<string:u_name>')
def user_details(u_name):
    '''Show user details if logged in'''
    if 'user_id' not in session:
        flash('Please log in first', 'warning')
        return redirect('/login')

    u = User.query.filter_by(username=u_name).first()
    if u:
        f_user = Feedback.query.filter_by(username=u_name).all()
        return render_template('user_details.html', u=u, f_user=f_user)
    # If no user found, show 404
    abort(404)


@app.route('/users/<string:u_name>/delete', methods=['POST'])
def user_delete(u_name):
    '''Delete logged in user'''
    if 'user_id' not in session:
        return redirect('/login')

    User.query.filter_by(id=session['user_id']).delete()
    db.session.commit()

    session.pop('user_id')
    flash(f'Nice knowing ya, @{u_name}', 'primary')
    return redirect('/')


@app.route('/users/<string:u_name>/feedback/add', methods=['GET', 'POST'])
def add_feedback(u_name):
    '''Show feedback form or submit it (if logged in)'''
    if 'user_id' not in session:
        flash('Please log in first', 'warning')
        return redirect('/login')

    u = User.query.filter_by(username=u_name).first()
    if u:
        # Verify user is adding feedback to own account
        if u.id != session['user_id']:
            abort(403)

        form = FeedbackForm()
        if form.validate_on_submit():
            title = form.title.data
            content = form.content.data

            f = Feedback(title=title, content=content, username=u_name)
            db.session.add(f)
            db.session.commit()
            return redirect(f'/users/{u_name}')

        return render_template('feedback_add_update.html', form=form, action='Add new', u_name=u_name)


@app.route('/feedback/<int:id>/update', methods=['GET', 'POST'])
def update_feedback(id):
    '''Show feedback update form or submit it (if logged in)'''
    if 'user_id' not in session:
        flash('Please log in first', 'warning')
        return redirect('/login')

    f = Feedback.query.get_or_404(id)
    u = f.user
    # Verify user is updating their own feedback
    if u.id != session['user_id']:
        abort(403)

    form = FeedbackForm(obj=f)
    if form.validate_on_submit():
        f.title = form.title.data
        f.content = form.content.data
        db.session.commit()
        return redirect(f'/users/{f.username}')

    return render_template('feedback_add_update.html', form=form, action='Update', u_name=f.username)


@app.route('/feedback/<int:id>/delete', methods=['POST'])
def delete_feedback(id):
    '''Delete user feedback (if logged in)'''
    if 'user_id' not in session:
        flash('Please log in first', 'warning')
        return redirect('/login')

    f = Feedback.query.get_or_404(id)
    u = f.user
    # Verify user is updating their own feedback
    if u.id != session['user_id']:
        abort(403)

    db.session.delete(f)
    db.session.commit()
    return redirect(f'/users/{f.username}')


# ---------------AUTHENTICATION-------------------


@app.route('/register', methods=['GET', 'POST'])
def register():
    '''Register new user or show register form'''
    if 'user_id' in session:
        # Redirect if already logged in
        return redirect(f'/users')

    form = RegisterForm()

    if form.validate_on_submit():
        # Returns false if username taken
        u = register_user(form)

        if u:
            session['user_id'] = u.id
            flash('Welcome! Here are our secrets.', 'success')
            return redirect(f'/users/{u.username}')

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
        return redirect(f'/users')

    form = LoginForm()

    if form.validate_on_submit():
        u = login_user(form)

        if u:
            session['user_id'] = u.id
            flash('Welcome back!', 'success')
            return redirect(f'/users/{u.username}')

        form.u_name.errors = ['Invalid username or password.']
    return render_template('login.html', form=form)


@app.route('/pwd-forgot', methods=['GET', 'POST'])
def pwd_forgot():
    '''Show email form to reset password, then
    "send and email" (show link on page) and save
    user data to reset password'''
    if 'user_id' in session:
        return redirect(f'/users')

    form = SendEmailForm()

    if form.validate_on_submit():
        u = User.query.filter_by(email=form.email.data).first()
        if u:
            # Save token and user to retrieve at different page
            session['reset_token'] = token_urlsafe(32)
            session['reset_user_id'] = u.id
            return render_template('pwd_forgot.html', token=session['reset_token'])

        # if not u: user not found
        form.email.errors = ['Email not found.']

    return render_template('pwd_forgot.html', form=form)


@app.route('/pwd-reset', methods=['GET', 'POST'])
def pwd_reset():
    '''Show new password form or process form data'''
    if 'user_id' in session:
        return redirect(f'/users')

    # Exit if token is invalid
    if request.args.get('token') != session['reset_token']:
        flash('The link you clicked was not valid, please try again', 'danger')
        return redirect('/login')

    form = PwdResetForm()
    if form.validate_on_submit():
        # Get user saved in session
        u = User.query.get(session['reset_user_id'])
        # Change password
        u.pass_hash = User.change_pwd(form.password.data)
        db.session.commit()

        # Remove data from session
        session.pop('reset_token')
        session.pop('reset_user_id')

        return redirect('/login')

    return render_template('pwd_reset.html', form=form)


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
