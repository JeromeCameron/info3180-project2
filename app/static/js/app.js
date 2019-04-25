/*global Vue*/
/*global fetch*/
/*global token*/
/*global Event*/
/*global localStorage*/
/*global VueRouter*/
"use strict";


//used to send info/events between components
window.Event = new Vue();
//-------------------------------------------
//app header
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color:#8134d4">
      <router-link to="/" class="navbar-brand"><img src="/static/icons/photograph.png" width="25" height="25" class="d-inline-block align-top" alt="">
      Photogram</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">

            <li class="nav-item active">
                <router-link to="/" class="nav-link">Home</router-link>
            </li>

            <li class="nav-item">
                <router-link to="/explore" class="nav-link">Explore</router-link>
            </li>

            <li class="nav-item">
                <router-link :to="'/users/' + userid" class="nav-link">My Profile</router-link>
            </li>

            <li class="nav-item" v-if="login">
                <router-link to="/logout" class="nav-link">Logout</router-link>
            </li>

            <li class="nav-item" v-else>
                <router-link to="/login" class="nav-link">Login</router-link>
            </li>

        </ul>
      </div>
    </nav>
    `,
    created: function(){

        //preserves data after page refresh
        //try-catch prevents Vue error in console which occurred because sessionStorage is empty until login
        try {
            if(JSON.parse(sessionStorage.login_status)["login_status"]==true){
                this.login = true;
                this.userid = JSON.parse(sessionStorage.user_id)["user_id"];
            }
        }
        catch(err) {
            this.login = false;
        }

        //event is triggered from login and logout route to change logout/login in nav-bar
        Event.$on('login_status', () =>{
            this.login = JSON.parse(sessionStorage.login_status)["login_status"];
            this.userid = JSON.parse(sessionStorage.user_id)["user_id"];
        });
    },

    data: function(){
        return{
            login: false,
            userid: ''
        };
    },
});

// __________________________________________________________________________________________________________________________________________________________________________________

//app footer
Vue.component('app-footer', {
    template: `
    <footer>
        <p>Copyright &copy; Flask Inc.</p>
        <div>Icons made by <a href="https://www.flaticon.com/authors/cole-bemis" title="Cole Bemis">Cole Bemis</a> from <a href="https://www.flaticon.com/"
        title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"
        title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
    </footer>
    `
});

// __________________________________________________________________________________________________________________________________________________________________________________

//login page
const Welcome = Vue.component('welcome', {
    template: `
    <div class="container">
        <div class="row">
            <div class="card-deck">
                <div class="card greeting-card">
                  <div class="card-body welcome">
                    <img src="/static/uploads/welcome.jpg" class="card-img" alt="">
                  </div>
                </div>

                <div class="card text-center greeting-card">
                  <div class="card-body">
                    <h5 class="card-title logo">
                        <img src="/static/icons/photograph.png" width="25" height="25" class="d-inline-block align-top" alt="">
                        Photogram
                    </h5>
                    <div id="delim"></div>
                    <p class="card-text text-left">Share photos of your favourite moments with friends, family and the world</p>
                    <br>
                    <router-link to="/register" class="btn btn-primary">Register</router-link>
                    <router-link to="/login" class="btn btn-secondary">Login</router-link>
                  </div>
                </div>
            </div>
        </div>
    </div>
    `
});

// __________________________________________________________________________________________________________________________________________________________________________________

//view all post
const AllPosts = Vue.component('all-posts', {
    template: `
    <div class="post-container">
        <ul id="ul" v-if="messages">
                <li v-for="message in messages" class="messages">{{ message }}</li>
        </ul>
        <router-link to="/posts/new" class="btn btn-primary btn-addPost">New Post</router-link>
        <ul v-if="user_posts.length != 0">
            <li v-for="post in user_posts">
                <div class="post card explore_cards shadow-sm" :id="post.id">

                    <div class= "card-header">
                        <router-link :to="'/users/' + post.user_id" class="nav-link">
                            <h6 class="card-subtitle text-muted">
                                <img :src= "'/static/uploads/' + post.prof_pic" class="tiny" />
                                {{ post.username }}
                            </h6>
                        </router-link>
                    </div>

                    <div class="post-body card-body">
                        <img :src="'/static/uploads/' + post.photo" class="post-img" v-on:dblclick="add_like" :id="post.id"/>
                        <p class="card-text">{{ post.caption }}</p>
                    </div>

                    <div class="post-footer text-muted">
                        <p style="float:left;" v-if="like_history(post.id)">
                        <img src="/static/icons/like.png" width="25" height="25" class="d-inline-block align-top" alt="" v-on:click="add_like" :id="post.id"> {{ post.likes }} likes</p>

                        <p style="float:left;" v-else>
                        <img src="/static/icons/like (3).png" width="25" height="25" class="d-inline-block align-top" alt="" v-on:click="add_like" :id="post.id"> {{ post.likes }} likes</p>

                        <p style="float:right;">{{ post.created_on }}</p>
                    </div>
                </div>
            </li>
        </ul>
        <div v-else>
            <p>Nothing to display yet</p>
        </div>
    </div>
    `,
    created: function() {
        let self = this;

        fetch('/api/posts',{
            'headers': {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
            }
        })

        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            self.user_posts=jsonResponse.user_posts;
        });

        //--------------- fetch likes data for add feature used in like_history function ------------------
        fetch("/api/posts/"+ this.logged_in_user +"/likes",{
            'headers': {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
            }
        })

        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            self.likes_log=(jsonResponse.send_likes);
        });
    },

    data: function() {
        return {
            user_posts: [],
            messages: [],
            logged_in_user: JSON.parse(sessionStorage.user_id)["user_id"],
            post_id: 0,
            likes_log: [],
            like_post: false
        };
    },

    methods: {

        add_like: function(event){ 
            //event.preventDefault();

            let self = this;
            let id = JSON.parse(sessionStorage.user_id);
            let user_id = parseInt(id['user_id']);
            self.post_id = event.currentTarget.id;
            

            fetch("/api/post/"+ this.post_id +"/like", {
            method: 'POST',
            body: JSON.stringify({user_id: user_id}),
            headers: {
                'X-CSRFToken': token,
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
            },
            credentials: 'same-origin'

            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success/error message
                console.log(jsonResponse);
                if (jsonResponse.message) {
                    self.messages = [];
                    self.messages.push(jsonResponse.message);

                    //run fetch again to update like count in real time
                    fetch('/api/posts',{
                        'headers': {
                            'Content-Type':'application/json',
                            'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
                        }
                    })

                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(jsonResponse) {
                        self.user_posts=jsonResponse.user_posts;
                    });
                    
                     //--------------- fetch likes data for add feature used in like_history function ------------------
                    fetch("/api/posts/"+ user_id +"/likes",{
                        'headers': {
                            'Content-Type':'application/json',
                            'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
                        }
                    })
            
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(jsonResponse) {
                        self.likes_log=(jsonResponse.send_likes);
                    });

                    document.getElementById("ul").setAttribute('class', 'alert alert-success');
                }
                else {
                    self.messages = [];
                    for (var i = 0; i < jsonResponse.errors.length; i++) {
                        self.messages.push(jsonResponse.errors[i]);
                    }
                    document.getElementById("ul").setAttribute('class', 'alert alert-danger');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },

        //function checks if a user already liked a post and allows the like heart to change to red if post already liked.
        like_history: function(post_id){
            let self = this;

            for(let x in this.likes_log){
                if(post_id == this.likes_log[x].post_id){
                    return true;
                }
            }
        }
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

// Register a new user
const ProfileForm = Vue.component('profile-form', {
    template: `
    <div class="container">
        <h4>Register</h4>
        <form @submit.prevent="newProfile" method='post' encType="multipart/form-data" class="form" id="profileForm">
            <ul id="ul" v-if="messages">
                <li v-for="message in messages" class="messages">{{ message }}</li>
            </ul>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" name="username" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="firstname">First Name</label>
                <input type="text" name="firstname" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="lastname">Last Name</label>
                <input type="text" name="lastname" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="location">Location</label>
                <input type="text" name="location" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="biography">Biography</label>
                <textarea name="biography" class="form-control"></textarea>
            </div>
            <div class="form-group">
                <label for="photo">Photo</label>
                <input type="file" name="photo" accept=".png, .jpg" class="form-control">
            </div>

            <button type="submit" name="register" class="btn btn-secondary">Register</button>
        </form>
    </div>
    `,
    data: function() {
        return {
            messages: [],
        };
    },
    methods: {
        newProfile: function() {
        let self = this;
        let profileForm = document.getElementById('profileForm');
        let form_data = new FormData(profileForm);

        fetch("/api/users/register", {
            method: 'POST',
            body: form_data,
            headers: {
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                if (jsonResponse.message) {
                    console.log(jsonResponse);
                    router.push({path:'/login'});
                }
                else {
                    self.messages = [];
                    for (var i = 0; i < jsonResponse.errors.length; i++) {
                        self.messages.push(jsonResponse.errors[i]);
                    }
                    document.getElementById("ul").setAttribute('class', 'alert alert-danger');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

//login a user
const LoginForm = Vue.component('login-form', {
    template: `
    <div class="container">
        <h4>Login</h4>
        <form @submit.prevent="login" method='post' class="form" id="login">
            <ul id="ul" v-if="messages.length > 0" class = "alert alert-danger">
                <li class="messages">{{ messages }}</li>
            </ul>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" name="username" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>

            <button type="submit" name="login" class="btn btn-primary">Login</button>
            <router-link to="/register" class="btn btn-secondary">Register</router-link>
        </form>
    </div>
    `,
    data: function() {
        return {
            messages: [],
            login_status: ''
        };
    },
    methods: {
        login: function() {
        let self = this;
        let loginForm = document.getElementById('login');
        let form_data = new FormData(loginForm);

        fetch("/api/auth/login", {
            method: 'POST',
            body: form_data,
            headers: {
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse.message);
                // self.message = jsonResponse.error;

                if ('error' in jsonResponse){
                    self.messages = jsonResponse.error;
                    // router.push("login");
                }else{
                    self.message = [];
                    router.push("explore");

                    // save user id in session
                    sessionStorage.user_id = JSON.stringify({"user_id":jsonResponse.id});
                    sessionStorage.login_status = JSON.stringify({"login_status": true});
                    self.login_status = JSON.parse(sessionStorage.login_status)["login_status"];
                    localStorage.JWT_token = JSON.stringify({"JWT_token":jsonResponse.token});
                    Event.$emit('login_status');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

//logout a user
const Logout = Vue.component('logout', {
    template: `
    <div>
    </div>
    `,
    created: function() {
        let self = this;

        fetch("/api/auth/logout", {
            method: 'GET',
            headers: {
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success message
                self.message.push(jsonResponse.message);
                console.log(self.message);
                localStorage.removeItem('JWT_token');
                sessionStorage.login_status = JSON.stringify({"login_status": false});
                sessionStorage.user_id = JSON.stringify({"user_id": null});
                Event.$emit('login_status');
                router.push("/");
                sessionStorage.removeItem('login_status');
                sessionStorage.removeItem('user_id');
            })
            .catch(function (error) {
                console.log(error);
            });

    },
    data: function () {
        return {
            message: [],
            login_status: ''
        };
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

// view a users profile
const MyProfile = Vue.component('my-profile', {
    template: `
    <div class="container" id="prof_container">
        <ul id="ul" v-if="messages">
            <li v-for="message in messages" class="messages">{{ message }}</li>
        </ul>
        <div class="card d-flex justify-content-between flex-row" id="box_container">

            <div id="box0" class="d-flex justify-content-start flex-row">
                <div id="box1">
                    <img :src= "'/static/uploads/' + user.profile_photo" class="profile_pic" />
                </div>

                <div id="box2">
                        <h5 id="user_name" class="card-title">{{ user.firstname }} {{ user.lastname }}</h5>
                        <p id="location">{{ user.location }}</p>
                        <p>Member since {{ user.joined_on }}</p>
                        <p class="biography_text">{{ user.biography }}</p>
                </div>
            </div>
            <div id="box3" class="d-flex justify-content-between flex-column">
                <div class="d-flex justify-content-between flex-row">

                    <div class="d-flex flex-column align-items-center">
                        <h5>{{ user.nPosts }}</h5>
                        <h6>Posts</h6>
                    </div>
                    <div class="d-flex flex-column align-items-center">
                        <h5 id="nfollowings">{{ user.nFollows }}</h5>
                        <h6>Followers</h6>
                    </div>

                </div>

                <div v-if="(logged_in_user!=user_id)" id="folldiv">
                    <div v-if="followers(user.user_id)">
                        <button class="btn btn-primary" id="follow-btn" v-on:click="add_follow">Following</button>
                    </div>

                    <div v-else>
                        <button class="btn btn-secondary" id="follow-btn" v-on:click="add_follow">Follow</button>
                    </div>
                </div>

            </div>
        </div>

        <ul v-if="user_posts.length != 0" class="d-flex flex-row flex-sm-wrap" id="post_list">
            <li v-for="post in user_posts" class="card">
                <img :src="'/static/uploads/' + post.photo" class="card-img"/>
                <div class="card-img-overlay"></div>
            </li>
        </ul>
        <div v-else>
            <p>Nothing to display yet</p>
            <router-link to="/posts/new" v-if="(logged_in_user==user_id)" class="btn btn-primary">New Post</router-link>
        </div>
    </div>
    `,
    created: function() {
        let self = this;

        //used to fetch user posts
        fetch("/api/users/" + this.user_id + "/posts", {
            'headers': {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            self.user_posts = jsonResponse.user_posts;
        });

        //used to fetch user info
        fetch("/api/users/" + this.user_id, {
            'headers': {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            self.user = jsonResponse.user;
        });

        //used to fetch follow relationships
        fetch("/api/posts/"+ this.logged_in_user +"/follows",{
            'headers': {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
            }
        })

        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            self.follows_log=(jsonResponse.followers);
        });
        
    },

    data: function() {
        return {
            user_id: this.$route.params.user_id,
            user_posts: [],
            user: [],
            messages: [],
            logged_in_user: JSON.parse(sessionStorage.user_id)["user_id"],
            follows_log: []
        };
    },
    methods: {

        add_follow: function(event){
            let self = this;
            let id = JSON.parse(sessionStorage.user_id);
            let follower_id = parseInt(id['user_id']);
            let user_id = parseInt(this.user_id);

            //Used to populate user follow relationships
            fetch("/api/users/"+ user_id +"/follow", {
            method: 'POST',
            body: JSON.stringify({follower_id: follower_id}),
            headers: {
                'X-CSRFToken': token,
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
            },
            credentials: 'same-origin'

            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success/error message
                console.log(jsonResponse);
                if (jsonResponse.message) {
                    self.messages = [];
                    self.messages.push(jsonResponse.message);
                    // let users_id = JSON.parse(sessionStorage.user_id)["user_id"];

                    //-----Request updated records after succesful follow-------
                    fetch("/api/users/" + user_id + "/posts",{
                        'headers': {
                            'Content-Type':'application/json',
                            'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
                        }
                    })
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(jsonResponse) {
                        self.user_posts = jsonResponse.user_posts;
                    });
                    
                    //--------Update the follow log----------
                    fetch("/api/posts/"+ follower_id +"/follows",{
                        'headers': {
                            'Content-Type':'application/json',
                            'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
                        }
                    })
            
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(jsonResponse) {
                        self.follows_log=(jsonResponse.followers);
                    });
                    
                    //--------Update the follow number----------
                    fetch("/api/users/"+ user_id +"/follow",{
                        'headers': {
                            'Content-Type':'application/json',
                            'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
                        }
                    })
            
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(jsonResponse) {
                        self.user.nFollows=parseInt(jsonResponse.followers);
                    });

                    //----------------------- END ------------------------------

                    document.getElementById("ul").setAttribute('class', 'alert alert-success');
                    // let follow_btn;
                    // this.user_posts[0].nFollows += 1;
                    // follow_btn = document.getElementById("follow-btn"); no need to disable btn since a msg is flashed when logged in user already following someone
                    // follow_btn.innerHTML = "Following";
                    // follow_btn.disabled = true;
                }
                else if(jsonResponse.info){
                    self.messages = [];
                    self.messages.push(jsonResponse.info);
                    document.getElementById("ul").setAttribute('class', 'alert alert-warning');
                }
                else {
                    self.messages = [];
                    for (var i = 0; i < jsonResponse.errors.length; i++) {
                        self.messages.push(jsonResponse.errors[i]);
                    }
                    document.getElementById("ul").setAttribute('class', 'alert alert-danger');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
            
            
        },

        //------------------------- followers func -----------------------------

        //function checks if a user already follows current user.
        followers: function(follower_id){
            let self = this;

            for(let x in this.follows_log){
                if(follower_id == this.follows_log[x].user_id){
                    return true;
                }
            }
        }
        //----------------------- End followers func ---------------------------
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

//add new post
const NewPost = Vue.component('new-post', {
    template: `
    <div class="container">
        <h4>New Post</h4>
        <form @submit.prevent="new_post" method='post' encType="multipart/form-data" class="form" id="posts">
            <ul id="ul" v-if="messages">
                <li v-for="message in messages" class="messages">{{ message }}</li>
            </ul>
            <div class="form-group">
                <label for="photo">Upload Photo</label>
                <input class="form-control" type="file" name="photo" accept=".png, .jpg">
            </div>
            <div class="form-group">
                <label for="caption">Caption</label>
                <textarea name="caption" class="form-control" required></textarea>
            </div>

            <button type="submit" name="post" class="btn btn-secondary">Post</button>
        </form>
    </div>
    `,
    data: function() {
        return {
            messages: [],
        };
    },
    methods: {
        new_post: function() {
        let self = this;
        let postForm = document.getElementById('posts');
        let form_data = new FormData(postForm);
        let id = JSON.parse(sessionStorage.user_id);
        let user_id = id['user_id'];

        fetch("/api/users/"+ user_id +"/posts", {
            method: 'POST',
            body: form_data,
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + JSON.parse(localStorage.JWT_token)["JWT_token"]
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                if (jsonResponse.message) {
                    self.messages = [];
                    self.messages.push(jsonResponse.message);
                    document.getElementById("ul").setAttribute('class', 'alert alert-success');
                    postForm.reset();
                }
                else {
                    self.messages = [];
                    for (var i = 0; i < jsonResponse.errors.length; i++) {
                        self.messages.push(jsonResponse.errors[i]);
                    }
                    document.getElementById("ul").setAttribute('class', 'alert alert-danger');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

//not found route
const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1 class="page-header">404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {};
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Welcome },
        {path: "/register", component: ProfileForm },
        {path: "/login", component: LoginForm },
        {path: "/logout", component: Logout },
        {path: "/explore", component: AllPosts },
        {path: "/users/:user_id", component: MyProfile },
        {path: "/posts/new", component: NewPost },
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// ____________________________________________________________________________

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});