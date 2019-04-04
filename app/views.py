from app import app, db
from flask import render_template, request, redirect, url_for, flash, session
from flask_login import login_user, logout_user, current_user, login_required
from app.models import Users, Posts, Likes, Follows
from app.forms import profileForm, posts, likes, follows
from datetime import datetime, date
import os
from werkzeug.utils import secure_filename


#________________________ API ROUTES (endpoints) ______________________________#

#Accepts user information and save it to the database
@app.route('/api/users/register', methods=["POST"])
def register():
    return "test"

#Accepts login credentials as username and password    
@app.route('/api/auth/login', methods=["POST"])
def login():
    return "test"

#logout user
@app.route('/api/auth/logout', methods=["GET"])
def logout():
    return "test"

#Used for adding posts to users feed
@app.route('/api/users/{user_id}/posts', methods=["POST"])
def addPost():
    return "test"

#Returns a user's posts    
@app.route('/api/users/{user_id}/posts', methods=["GET"])
def viewPost():
    return "test"

#Create a follow relationship between the current user and the target user   
@app.route('/api/users/{user_id}/follow', methods=["POST"])
def follow():
    return "test"

#Return all posts for all users   
@app.route('/api/post', methods=["GET"])
def allPost():
    return "test"
    
#Set a like on the current Post by the logged user    
@app.route('/api/post/{post_id}/like', methods=["POST"])
def addLike():
    return "test"

#______________________________ END API Routes ________________________________#


#Render home page
@app.route('/')
def home():
    return render_template('home.html')

#Render about page   
@app.route('/about/')
def about():
    return render_template('about.html')

 

#####_______________________________________________________________________________________________#####

###
# The functions below should be applicable to all Flask apps.
###

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


# @app.errorhandler(404)
# def page_not_found(error):
#     """Custom 404 page."""
#     return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")