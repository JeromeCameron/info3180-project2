from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask import session
from flask_wtf.csrf import CSRFProtect

UPLOAD_FOLDER = './app/static/uploads'
app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = "@#$%my$ecretKey@#$%*"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://project2:project2@localhost/project2"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views