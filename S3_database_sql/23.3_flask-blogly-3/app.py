"""Blogly application."""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, User, Post, Tag, PostTag

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = 'SEC'
connect_db(app)


@app.route('/')
def home():
    '''Show posts sorted by newest'''
    posts = Post.query.order_by('created_at').all()
    return render_template('home.html', posts=posts)


@app.errorhandler(404)
def not_found(e):
    '''Show error page'''
    return render_template('404.html')


@app.errorhandler(405)
def not_allowed(e):
    '''Show error page'''
    return not_found(e)


@app.route('/users')
def user_list():
    '''Show list of users'''
    return render_template('users/list.html', users=User.query.all())


@app.route('/users/new')
def user_add_form():
    '''Show form to add user'''
    return render_template('users/add_form.html')


@app.route('/users/new', methods=['POST'])
def user_add():
    '''Add user to db and redirect to user list, 
    Flash error message if error encountered'''
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    img_url = request.form['img_url']
    img_url = None if not img_url else img_url

    if not first_name or not last_name:
        flash('Please fill in both first and last name!', 'danger')
        return redirect('/users/new')

    if len(first_name) > 20 or len(last_name) > 20:
        flash('Your first name or last name cannot be \
        longer than 20 characters.', 'warning')
        return redirect('/users/new')

    user = User(first_name=first_name, last_name=last_name, img_url=img_url)
    db.session.add(user)
    db.session.commit()

    return redirect('/users')


@app.route('/users/<int:id>')
def user_details(id):
    '''Show name, pfp, posts and manage buttons for user'''
    user = User.query.get_or_404(id)
    posts = user.posts
    return render_template('users/details.html', user=user, posts=posts)


@app.route('/users/<int:id>/posts')
def redir_to_user(id):
    '''Redirect user posts to user page'''
    return redirect(f'/users/{id}')


@app.route('/users/<int:id>/edit')
def user_edit_form(id):
    '''Show form to edit user'''
    user = User.query.get_or_404(id)
    return render_template('users/edit_form.html', user=user)


@app.route('/users/<int:id>/edit', methods=['POST'])
def user_edit(id):
    '''Edit user and redirect to user details'''
    user = User.query.get_or_404(id)
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    img_url = request.form['img_url']

    if len(first_name) > 20 or len(last_name) > 20:
        flash('Your first name or last name cannot be \
        longer than 20 characters.', 'warning')
        return redirect(f'/users/{id}/edit')

    # Change values if they're not null
    user.first_name = first_name if first_name else user.first_name
    user.last_name = last_name if last_name else user.last_name
    user.img_url = img_url if img_url else user.img_url

    # Add changes to db
    db.session.add(user)
    db.session.commit()

    return redirect(f'/users/{id}')


@app.route('/users/<int:id>/delete', methods=['POST'])
def user_delete(id):
    '''Delete user and redirect to user list'''
    User.query.filter_by(id=id).delete()
    db.session.commit()

    return redirect('/users')


@app.route('/users/<int:id>/posts/new')
def user_post_new_form(id):
    '''Show form to make new post'''
    user = User.query.get_or_404(id)
    tag_list = Tag.query.all()
    return render_template('posts/add_form.html', user=user, tag_list=tag_list)


@app.route('/users/<int:id>/posts/new', methods=['POST'])
def user_add_post(id):
    '''Add new post and show it'''
    title = request.form['title']
    content = request.form['content']

    # Return if title empty or too long
    if title == '':
        flash('Please enter a title!', 'danger')
        return redirect(f'/users/{id}/posts/new')

    if len(title) > 50:
        flash('Your title is too long (no greater than 50 char)', 'warning')
        return redirect(f'/users/{id}/posts/new')

    post = Post(user_id=id, title=title, content=content)

    # Add selected tags to post
    tag_ids = request.form.getlist('tag')
    if tag_ids:
        for tag_id in tag_ids:
            post.tags.append(Tag.query.get(tag_id))

    db.session.add(post)
    db.session.commit()

    return redirect(f'/posts/{post.id}')


@app.route('/posts')
def redir_to_home():
    '''Show home page (list of posts)'''
    return redirect('/')


@app.route('/posts/<int:id>')
def post_details(id):
    '''Show title and content with modify buttons'''
    post = Post.query.get_or_404(id)
    author = post.user
    return render_template('posts/details.html', post=post, author=author)


@app.route('/posts/<int:id>/edit')
def post_edit_form(id):
    '''Show form to edit post'''
    post = Post.query.get_or_404(id)
    tag_list = Tag.query.all()
    return render_template('posts/edit_form.html', post=post, tag_list=tag_list)


@app.route('/posts/<int:id>/edit', methods=['POST'])
def post_edit(id):
    '''Edit post and redirect to post details'''
    post = Post.query.get_or_404(id)
    title = request.form['title']
    content = request.form['content']

    if len(title) > 50:
        flash('Your title is too long (no greater than 50 char)', 'warning')
        return redirect(f'/posts/{id}/edit')

    # Change values if they're not null
    post.title = title if title else post.title
    post.content = content if content else post.content

    # Add selected tags to post
    tag_ids = request.form.getlist('tag')
    if tag_ids:
        post.tags.clear()
        for tag_id in tag_ids:
            post.tags.append(Tag.query.get(tag_id))

    db.session.add(post)
    db.session.commit()

    return redirect(f'/posts/{id}')


@app.route('/posts/<int:id>/delete', methods=['POST'])
def post_delete(id):
    '''Delete post and return home'''
    Post.query.filter_by(id=id).delete()
    db.session.commit()

    return redirect('/')


@app.route('/tags')
def tag_list():
    '''Show list of tags'''
    return render_template('tags/list.html', tags=Tag.query.all())


@app.route('/tags/<int:id>')
def tag_details(id):
    '''Show name and posts and manage buttons for tag'''
    tag = Tag.query.get_or_404(id)
    posts = tag.posts
    return render_template('tags/details.html', tag=tag, posts=posts)


@app.route('/tags/new')
def tag_add_form():
    '''Show form to add tag'''
    post_list = Post.query.all()
    return render_template('tags/add_form.html', post_list=post_list)


@app.route('/tags/new', methods=['POST'])
def tag_add():
    '''Add tag to db and redirect to tag list,
    Flash error message if error encountered'''
    tag_name = request.form['tag_name']

    if not tag_name:
        flash('Please enter a tag name!', 'danger')
        return redirect('/tags/new')

    if len(tag_name) > 10:
        flash('Your tag cannot be longer than 10 characters.', 'warning')
        return redirect('/tags/new')

    tag = Tag(name=tag_name)

    # Add tag to selected posts
    post_ids = request.form.getlist('post')
    if post_ids:
        for post_id in post_ids:
            tag.posts.append(Post.query.get(post_id))

    db.session.add(tag)
    db.session.commit()

    return redirect('/tags')


@app.route('/tags/<int:id>/edit')
def tag_edit_form(id):
    '''Show form to edit tag'''
    tag = Tag.query.get_or_404(id)
    post_list = Post.query.all()
    return render_template('tags/edit_form.html', tag=tag, post_list=post_list)


@app.route('/tags/<int:id>/edit', methods=['POST'])
def tag_edit(id):
    '''Edit tag and redirect to tag details'''
    tag = Tag.query.get_or_404(id)
    tag_name = request.form['tag_name']

    if len(tag_name) > 10:
        flash('Your tag cannot be longer than 10 characters.', 'warning')
        return redirect(f'/tags/{id}/edit')

    # Change values if they're not null
    tag.name = tag_name if tag_name else tag.name

    # Add tag to selected posts
    post_ids = request.form.getlist('post')
    if post_ids:
        tag.posts.clear()
        for post_id in post_ids:
            tag.posts.append(Post.query.get(post_id))

    db.session.add(tag)
    db.session.commit()

    return redirect(f'/tags/{id}')


@app.route('/tags/<int:id>/delete', methods=['POST'])
def tag_delete(id):
    '''Delete tag and show tag list'''
    Tag.query.filter_by(id=id).delete()
    db.session.commit()

    return redirect('/tags')
