from flask_wtf import FlaskForm
from wtforms import StringField, URLField, BooleanField, IntegerField, TextAreaField
from wtforms.validators import InputRequired, Optional, URL, NumberRange, AnyOf


class PetForm(FlaskForm):
    '''Form for adding a pet
    ```ruby
    name      = STRING <required>
    species   = STRING <required>, only 'Cat', 'Dog', 'Porcupine' allowed
    photo_url = URL <optional>
    age       = INT <optional> min=0, max=30
    notes     = STRING <optional>
    available = BOOL <optional>
    '''

    name = StringField('Pet Name', validators=[
                       InputRequired(message='Please enter a name!')])
    species = StringField('Pet Species (Capitalized)', validators=[
        InputRequired(message='Please enter a species!'),
        AnyOf(('Cat', 'Dog', 'Porcupine'), message="We don't accept those anymore.")])
    photo_url = URLField('Image link (optional)', validators=[
        URL(message='That link is invalid.'), Optional()])
    age = IntegerField('Age', validators=[
        NumberRange(min=0, message='The age must be positive!'),
        NumberRange(max=30, message="Pets don't live that long..."), Optional()])
    notes = TextAreaField('Notes')
    available = BooleanField('Available')
