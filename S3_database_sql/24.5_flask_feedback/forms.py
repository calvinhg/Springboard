from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, TextAreaField
from wtforms.validators import InputRequired, Length, EqualTo


class FeedbackForm(FlaskForm):
    title = StringField('Title', validators=[
        InputRequired(message='Please enter a title.'),
        Length(max=100, message='Too long (max 100 characters).')])
    content = TextAreaField('Write your review', validators=[
        InputRequired(message='Please enter a review.')],
        render_kw={'rows': 10})  # textarea rows


class RegisterForm(FlaskForm):
    u_name = StringField('Username', validators=[
        InputRequired(message='Please enter a username.')])
    password = PasswordField('Password', validators=[
        InputRequired(message='Please enter a password.')])
    email = EmailField('Email', validators=[
        InputRequired(message='Please enter an email.'),
        Length(max=50, message='That email is too long (max 50 characters).')])
    f_name = StringField('First Name', validators=[
        InputRequired(message='Please enter your first name.'),
        Length(max=30, message='Too long (max 30 characters).')])
    l_name = StringField('Last Name', validators=[
        InputRequired(message='Please enter your last name.'),
        Length(max=30, message='Too long (max 30 characters).')])


class LoginForm(FlaskForm):
    u_name = StringField('Username', validators=[
        InputRequired(message='Please enter a username.')])
    password = PasswordField('Password', validators=[
        InputRequired(message='Please enter a password.')])


class SendEmailForm(FlaskForm):
    email = EmailField('Email', validators=[
        InputRequired(message='Please enter an email.')])


class PwdResetForm(FlaskForm):
    password = PasswordField('New Password', validators=[
        InputRequired(message='Please enter a password.')])
    pass2 = PasswordField('Enter Password Again', validators=[
        InputRequired(message='Please enter a password.'),
        EqualTo('password', message='Passwords do not match.')])
