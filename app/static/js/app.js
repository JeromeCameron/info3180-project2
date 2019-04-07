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
    `
})

const AllPosts = Vue.component('all-posts', {
    template: `
    <div class="container">
        <a href="/posts/new" class="btn btn-primary">New Post</a>
        <ul class="">
            <li v-for="post in user_posts" class="">
                <div class="card">
                    <div class="card-header">
                        <router-link to="/users/{{ user_id }}" class="nav-link">
                            <img :src="post.user_id.photo" class="" />
                            post.user_id.username
                        </router-link>
                        
                    </div>
                    <div class="card-body">
                        <img src="/static/uploads/"  alt="">
                        <img :src="post.urlToImage" class="" />
                        <p class="card-text">post.caption</p>
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
            user_posts: [],
        }
    },
    methods: {
        get_all_posts: function() {
        let self = this;
        fetch('/api/posts')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                self.user_posts = data.user_posts;
            });
        }
    } 
})

const ProfileForm = Vue.component('profile-form', {
    template: 
    `
    <div class="container">
        <h4>Register</h4>
        <ul id="ul" v-if="messages">
            <li v-for="message in messages" class="messages">{{ message }}</li>
        </ul>
        <form @submit.prevent="newProfile" method='post' encType="multipart/form-data" class="form" id="profileForm">
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
                router.push(`Welcome`)
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
        <ul id="ul" v-if="messages">
            <li v-for="message in messages" class="messages">{{ message }}</li>
        </ul>
        <form @submit.prevent="login" method='post' class="form" id="login">
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
                router.push("explore")
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
    }
})

const MyProfile = Vue.component('my-profile', {
    template: `
        <div class="">
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
        </div>
        <ul class="">
            <li v-for="post in user_posts" class="">
                <div class="card">
                    <div class="card-header">
                        <router-link to="/users/<user_id>" class="nav-link">
                            <img :src="post.user_id.photo" class="" />
                            post.user_id.username
                        </router-link>
                        
                    </div>
                    <div class="card-body">
                        <img src="/static/uploads/"  alt="">
                        <img :src="post.urlToImage" class="" />
                        <p class="card-text">post.caption</p>
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
    </div>
    `,
    data: function () {
        return {}
    }
})

const NewPost = Vue.component('new-post', {
    template: `
    <div class="container">
        <h4>New Post</h4>
        <ul id="ul" v-if="messages">
            <li v-for="message in messages" class="messages">{{ message }}</li>
        </ul>
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
        
        fetch("/api/users/<user_id>/posts", {
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