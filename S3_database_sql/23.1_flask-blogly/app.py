"""Blogly application."""

from flask import Flask, request, redirect, render_template
from models import db, connect_db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)


@app.route('/')
def home():
    return redirect('/users')


@app.errorhandler(404)
def not_found(e):
    return render_template('404.html')


@app.errorhandler(405)
def not_allowed(e):
    return not_found(e)


@app.route('/users')
def user_list():
    return render_template('user_list.html', users=User.query.all())


@app.route('/users/new')
def user_add_form():
    return render_template('user_add_form.html')


@app.route('/users/new', methods=['POST'])
def user_add():
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    img_url = request.form['img_url']
    img_url = None if img_url == '' else img_url

    if first_name == '' or last_name == '':
        return redirect('/users/new')

    user = User(first_name=first_name, last_name=last_name, img_url=img_url)
    db.session.add(user)
    db.session.commit()

    return redirect('/users')


@app.route('/users/<int:id>')
def user_details(id):
    user = User.query.get_or_404(id)
    return render_template('user_details.html', user=user)


@app.route('/users/<int:id>/edit')
def user_edit_form(id):
    user = User.query.get_or_404(id)
    return render_template('user_edit_form.html', user=user)


@app.route('/users/<int:id>/edit', methods=['POST'])
def user_edit(id):
    user = User.query.get_or_404(id)

    for k, v in request.form.items():
        if v != '':
            exec(f'user.{k} = v')

    db.session.add(user)
    db.session.commit()

    return redirect(f'/users/{id}')


@app.route('/users/<int:id>/delete', methods=['POST'])
def user_delete(id):
    User.query.filter_by(id=id).delete()
    db.session.commit()

    return redirect('/users')
