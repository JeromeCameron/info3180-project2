from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask import session
from flask_wtf.csrf import CSRFProtect

UPLOAD_FOLDER = './app/static/uploads'
app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = "@#$%my$ecretKey@#$%*"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://xllccityhagvdw:44782820358f59ce9d1ec19fa218328a19aba69ffcb24cfb2b1b8e049dd0a0bc@ec2-54-235-114-242.compute-1.amazonaws.com:5432/d1stvv7mrp01ga' #'postgresql://project2:project2@localhost/project2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views