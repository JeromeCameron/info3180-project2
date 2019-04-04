from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, IntegerField
from wtforms.validators import InputRequired, DataRequired, Email
from flask_wtf.file import FileField, FileRequired, FileAllowed
from werkzeug.utils import secure_filename


class profileForm(FlaskForm):
    username = StringField('User Name', validators=[InputRequired()])
    firstname = StringField('First Name', validators=[InputRequired()])
    lastname = StringField('Last Name', validators=[InputRequired()])
    email = StringField('Email', validators=[InputRequired(), Email()])
    location = StringField('Location', validators=[InputRequired()])
    biography = TextAreaField('Biography', validators=[InputRequired()])
    profile_photo = FileField('Profile Photo', validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])
    password = PasswordField('Password', validators=[InputRequired()])
    
class posts(FlaskForm):
    user_id = IntegerField('User ID', validators=[InputRequired()])
    photo = FileField('Photo', validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])
    caption = TextAreaField('Caption', validators=[InputRequired()])
    
class likes(FlaskForm):
    user_id = IntegerField('User ID', validators=[InputRequired()])
    post_id = IntegerField('Post ID', validators=[InputRequired()])
  
    
class follows(FlaskForm):
    user_id = IntegerField('User ID', validators=[InputRequired()])
    follower_id = IntegerField('Follower ID', validators=[InputRequired()])