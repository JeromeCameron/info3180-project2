from app import app, db, login_manager, session
from flask import render_template, request, redirect, url_for, flash, jsonify,  _request_ctx_stack
from flask_login import login_user, logout_user, current_user, login_required
from app.models import Users, Posts, Likes, Follows
from app.forms import profileForm, posts,  Login_user
from datetime import datetime, date
import os
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
# import jwt
from functools import wraps
import base64


#________________________ API ROUTES (endpoints) ______________________________#

#Accepts user information and save it to the database
@app.route('/api/users/register', methods=["POST"]) #This works now
def register():
    
    form = profileForm()
    
    if request.method == "POST" and form.validate_on_submit():
        #collect form data
        username = form.username.data
        firstname = form.firstname.data
        lastname = form.lastname.data
        password = form.password.data
        email = form.email.data
        location = form.location.data
        biography = form.biography.data
        profile_photo = form.photo.data
        filename = secure_filename(profile_photo.filename)
        
        #set custom file name for reference which will be saved in tbe database
        if filename.endswith('.' + "png"):
             photo_name = "pic_"+ firstname +"_"+ email +".png"
        elif filename.endswith('.' + "jpg"):
              photo_name = "pic_"+ firstname +"_"+ email + ".jpg"
        
        profile_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_name))
             
        #connect to database and save data
        user_profile = Users(username,firstname, lastname, email, location, biography, photo_name, password )
        db.session.add(user_profile)
        db.session.commit()
        
        data = {"message": "User successfully registered"}
        return jsonify({"message":data['message']})
        
    return jsonify({"errors": form_errors(form)})
    

#Accepts login credentials as username and password    
@app.route('/api/auth/login', methods=["POST"])
def log_in():
    
    form = Login_user()
    
    if request.method == "POST" and form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        
        user = Users.query.filter_by(username=username).first()
        
        if user is not None and check_password_hash(user.password, password):
            session['id'] = user.id
            login_user(user)
            
            #token = genJWTtoken()
            
            data =  {"token":"JWT token should here","message": "Welcome "+user.firstname}
            return jsonify({"message":data['message'], "id":session['id'], "token":data['token']})
        
        return jsonify({"error": "Incorrect username or password"})
        
#logout user
@app.route('/api/auth/logout', methods=["GET"])
#@login_required
def logout():
    
    logout_user()
    session.pop('id', None)
    data = {"message": "See you soon!"}
    return jsonify({"message":data['message']})


#Used for adding posts to users feed
@app.route('/api/users/<user_id>/posts', methods=["POST"]) # This route works on postman
#@login_required
def addPost(user_id):
    
    form = posts()
    
    if request.method == "POST" and form.validate_on_submit():
        #collect from data
        photo = form.photo.data#request.json['photo']
        description = form.caption.data #request.json['description']
        
        filename = secure_filename(photo.filename)
        add_date = datetime.now().strftime("%d-%b-%Y (%H:%M:%S.%f)") #used in file name to make it unique
            
        #set custom file name for reference which will be saved in the database
        if filename.endswith('.' + "png"):
            photo_name = "pic_"+ add_date +"_"+ user_id +".png"
        elif filename.endswith('.' + "jpg"):
            photo_name = "pic_"+ add_date +"_"+ user_id + ".jpg"
        
        photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_name))
            
        #connect to database and save data
        user_posts = Posts(user_id, photo_name, description)
        db.session.add(user_posts)
        db.session.commit()
        
        data = {"message": "Successfully created a new post"}
        
        return jsonify({"message":data['message']})
        
    return jsonify({"errors": form_errors(form)})

#Returns a single user's posts    
@app.route('/api/users/<int:user_id>/posts', methods=["GET"])# This route works on postman
#@login_required
def viewPost(user_id):
    
    #connect to database and fectch user posts
    db_posts = Posts.query.filter_by(user_id=user_id).all()
    user_info = Users.query.get(user_id)
    followers = Follows.query.filter_by(user_id=user_id).all()
    nFollows = len(followers)
    nPosts = len(db_posts)
    
    user_posts = []
    
    for posts in db_posts:
        
        data = {
              "id": posts.id,
              "user_id": posts.user_id,
              "photo": posts.photo,
              "caption": posts.caption,
              "created_on": posts.created_on.strftime("%d %B %Y"),
              "prof_pic": user_info.profile_photo,
              "firstname": user_info.firstname,
              "lastname": user_info.lastname,
              "location": user_info.location,
              "joined_on": user_info.joined_on.strftime("%B %Y"),
              "bio": user_info.biography,
              "nPosts": nPosts,
              "nFollows": nFollows
            }
        user_posts.append(data)
        
    return jsonify({'user_posts':user_posts})

#Create a follow relationship between the current user and the target user   
@app.route('/api/users/<user_id>/follow', methods=["POST"]) # This route works on postman
#@login_required
def follow(user_id):
    
    if request.method == "POST":
        #collect from data
        # user_id = request.json['user_id']
        follower_id = request.json['follower_id']
        
    
        #connect to database and save data
        # follow_user = Follows(user_id,follower_id)
        # db.session.add(follow_user)
        # db.session.commit()
        
        # data = {"message": "You are now following that user"}
        
        # return jsonify({"message":data['message']})
    return jsonify({"message": "here"})


#Return all posts for all users   
@app.route('/api/posts', methods=["GET"]) # This route works on postman
# @login_required
def allPost():
    
    #connect to database and fectch user posts
    db_posts = Posts.query.order_by(Posts.created_on).all()
    user_posts = []
    
    for posts in db_posts:
        
        user = Users.query.filter_by(id=posts.user_id).first()
        prof_pic = user.profile_photo
        username = user.username
        
        likes = Likes.query.filter_by(post_id = posts.id).count()
        
        data = {
              "prof_pic": prof_pic,
              "username": username,
              "id": posts.id,
              "user_id": posts.user_id,
              "photo": posts.photo,
              "caption": posts.caption,
              "likes": likes,
              "created_on": posts.created_on.strftime("%d %B %Y")
            }
        user_posts.append(data)
        
    return jsonify({'user_posts':user_posts})
 
    
#Set a like on the current Post by the logged user    
@app.route('/api/post/<post_id>/like', methods=["POST"]) # This route works on postman
#@login_required
def addLike():
    
    #collect from data
    user_id = request.json['user_id']
    post_id = request.json['post_id']

    #connect to database and save data
    likes = Likes(user_id,post_id)
    db.session.add(likes)
    db.session.commit()
    
    count = Likes.query.filter_by(post_id=post_id).count()
    
    data = {
              "message": "Post liked!",
              "likes": count
            }
    
    return jsonify({'data':data})

#______________________________ END API Routes ________________________________#


#####_______________________________________________________________________________________________#####

# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

#####_______________________________________________________________________________________________#####

@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))
    

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".
    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

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