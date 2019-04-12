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
            <router-link to="/users/<user_id>" class="nav-link">My Profile</router-link>
          </li>

            <li class="nav-item">
                <router-link to="/login" class="nav-link">Login</router-link> <!--toggle login/logout for authenticated user-->
            </li>
        
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
            <div>Icons made by <a href="https://www.flaticon.com/authors/cole-bemis" title="Cole Bemis">Cole Bemis</a> from <a href="https://www.flaticon.com/" 		    
            title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 		    
            title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </div>
    </footer>
    `
});

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
                    <router-link to="/register" class="btn btn-primary">Register</router-link>
                    <router-link to="/login" class="btn btn-secondary">Login</router-link>
                  </div>
                </div>
            </div>
        </div>
    </div>
    `
})

const AllPosts = Vue.component('all-posts', {
    template: `
    <div class="container">
        <router-link to="/posts/new" class="btn btn-primary" style="float:right; margin-left:1em;">New Post</router-link>
        <ul v-if="user_posts.length != 0">
            <li v-for="post in user_posts">
                <div class="card">
                        <router-link to="/users/post.user_id" class="nav-link">
                            <h6 class="card-subtitle mb-2 text-muted">
                                <img :src= "'/static/uploads/' + post.prof_pic" class="post-img tiny" />
                                {{ post.username }}
                            </h6>
                        </router-link>
                    <div class="card-body">
                        <img :src="'/static/uploads/' + post.photo" class="post_pic" />
                        <p class="card-text">{{ post.caption }}</p>
                    </div>
                    <div class="text-muted">
                        <p><img src="/static/icons/like (3).png" width="25" height="25" class="d-inline-block align-top" alt=""> {{ post.likes }}  likes</p>
                        <!--Example of badge with counter...might be able to use this for the likes counter-->
                        <a class="btn btn-primary">
                            <span class="badge badge-light">9</span> likes
                        </a>
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
        
        fetch('/api/posts')
        
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            self.user_posts=jsonResponse.user_posts;
            console.log(self.user_posts.length);
            // return self.posts
            // self.user_posts = data.user_posts;
        });
    },
    data: function() {
        return {
            user_posts: []
        };
    }
});

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
                <input type="file" name="photo" class="form-control">
            </div>
            
            <button type="submit" name="register" class="btn btn-secondary">Register</button>
        </form>
    </div>
    `,
    data: function() {
        return {
            messages: [],
        }
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
                // display a success/error message
                console.log(jsonResponse);
                router.push({path:'/login'})
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
})

const LoginForm = Vue.component('login-form', {
    template: `
    <div class="container">
        <h4>Login</h4>
        <form @submit.prevent="login" method='post' class="form" id="login">
            <ul id="ul" v-if="messages.length > 0" class = "alert-danger">
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
        }
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
                console.log(jsonResponse);
                // self.message = jsonResponse.error; 

                if ('error' in jsonResponse){
                    self.messages = jsonResponse.error; 
                    // router.push("login");
                }else{
                    self.message = [];
                    router.push("explore");
                    // save user id in session
                    sessionStorage.user_id= JSON.stringify({"user_id":jsonResponse.id})
                    // logged_in = true; was tinking of using this to switch the login/logout in navbar but nah can delete
                }
                
                
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
})

const Logout = Vue.component('logout', {
    template: `
    <div>
        <h1 class="page-header">404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    },
    methods: {
        logout: function() {
        let self = this;
        
        fetch("/api/auth/logout", {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                sessionStorage.removeItem('user_id');
                router.push("/");
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
})

const MyProfile = Vue.component('my-profile', {
    template: `
    <div class="container">
        <div class="card">
            <div class="row">
                <div class="col-md-3 img-holder">
                    <img src="/static/avatars/002-girl-26.png" class="card-img jumbo" alt="...">
                </div>
                <div class="col-md-4">
                    <div class="card-body">
                        <h5 class="card-title">First name Last name</h5>
                        <br>
                        <p class="card-text">Location</p>
                        <p class="card-text">Member since date</p>
                        <br>
                        <p class="card-text">Biography</p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card-body">
                        <p style="float:left;">Posts</p>
                        <p style="float:right;">Followers</p>
                        <button class="btn btn-secondary">Follow</button>
                    </div>
                </div>
            </div>
        </div>
        <ul v-if="user_posts.length != 0" >
            <li v-for="post in user_posts" class="">
                <div class="card">
                    <div class="card-header">
                        <router-link to="/users/<user_id>" class="nav-link">
                            <img :src="post.user_id.photo" class="post-img" />
                            {{ post.user_id }} <!--modify to show username-->
                        </router-link>
                    </div>
                    <div class="card-body">
                        <img :src="post.photo" class="" />
                        <p class="card-text">{{ post.caption }}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                    <div class="card-footer text-muted">
                        <p><img src="/static/icons/like (3).png" width="25" height="25" class="d-inline-block align-top" alt=""># likes</p>
                        <!--Example of badge with counter...might be able to use this for the likes counter-->
                        <button type="button" class="btn btn-primary">
                            Profile <span class="badge badge-light">9</span>
                            <span class="sr-only">likes</span>
                        </button>
                        <!-- add date of post -->
                    </div>
                </div>
            </li>
        </ul>
        <div v-else>
            <p>Nothing to display yet</p>
            <router-link to="/posts/new" class="btn btn-primary">New Post</router-link>
        </div>
    </div>
    `,
    created: function() {
        let self = this;
        
        fetch('/api/posts')
        
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            self.user_posts = data.user_posts;
        });
    },
    data: function() {
        return {
            user_posts: []
        }
    }
});

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
                <input class="form-control" type="file" name="photo" accept="image/*">
            </div>
            <div class="form-group">
                <label for="caption">Caption</label>
                <textarea name="caption" class="form-control"></textarea>
            </div>
            
            <button type="submit" name="post" class="btn btn-secondary">Post</button>
        </form>
    </div>
    `,
    data: function() {
        return {
            messages: [],
        }
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
                    self.messages = [];
                    self.messages.push(jsonResponse.message);
                    document.getElementById("ul").setAttribute('class', 'alert alert-success');
                    postForm.reset()
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
})

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1 class="page-header">404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Welcome },
        {path: "/register", component: ProfileForm },
        {path: "/login", component: LoginForm },
        {path: "/logout", component: Logout },
        {path: "/explore", component: AllPosts },
        {path: "/users/<user_id>", component: MyProfile },
        {path: "/posts/new", component: NewPost },
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});