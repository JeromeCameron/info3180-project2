from . import db
from werkzeug.security import generate_password_hash
from datetime import datetime

class Users(db.Model):
    
    __tablename__ = 'user_profiles'

    ID = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    firstname = db.Column(db.String(80))
    lastname = db.Column(db.String(80))
    email = db.Column(db.String(80), unique=True)
    location = db.Column(db.String(255))
    biography = db.Column(db.VARCHAR)
    joined_on = db.Column(db.DateTime, nullable=False, default=datetime.now)
    profile_photo = db.Column(db.String(150))
    password = db.Column(db.String(255), nullable=False)
    
    def __init__(self, username, firstname, lastname, email, location, biography, joined_on, profile_photo, password):
        self.username = username
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.location = location
        self.biography = biography
        self.joined_on = joined_on
        self.profile_photo = profile_photo
        self.password =  generate_password_hash(password, method='pbkdf2:sha256')
        
        def is_authenticated(self):
            return True

        def is_active(self):
            return True
    
        def is_anonymous(self):
            return False
    
        def get_id(self):
            try:
                return unicode(self.id)  # python 2 support
            except NameError:
                return str(self.id)  # python 3 support
    
        def __repr__(self):
            return '<User %r>' % (self.username)

################################################################################

class Posts(db.Model):
    
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    photo = db.Column(db.String(150))
    caption = db.Column(db.VARCHAR)
    created_on = db.Column(db.DateTime, nullable=False, default=datetime.now)
    
    def __init__(self, user_id, photo, caption, created_on):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on
        
################################################################################

class Likes(db.Model):
    
    __tablename__ = 'likes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer)
    
    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id

################################################################################

class Follows(db.Model):
    
    __tablename__ = 'follow'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    follower_id = db.Column(db.Integer)
    
    def __init__(self, user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id