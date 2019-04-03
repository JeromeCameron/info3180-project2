from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SelectField 
from wtforms.validators import InputRequired, DataRequired, Email
from flask_wtf.file import FileField, FileRequired, FileAllowed
from werkzeug.utils import secure_filename


class profileForm(FlaskForm):
    firstName = StringField('First Name', validators=[InputRequired()])
    lastName = StringField('Last Name', validators=[InputRequired()])
    gender = SelectField('Gender', choices = [('s','Select Gender'),('Male','Male'), ('Female','Female')], validators=[InputRequired()])
    email = StringField('Email', validators=[InputRequired(), Email()])
    location = StringField('Location', validators=[InputRequired()])
    biography = TextAreaField('Biography', validators=[InputRequired()])
    photo = FileField('image', validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])