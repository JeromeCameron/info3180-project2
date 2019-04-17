/*global Vue*/
/*global fetch*/
/*global token*/
/*global VueRouter*/

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
                <router-link :to="'/users/' + user_id.user_id" class="nav-link">My Profile</router-link>
            </li>
              
            <li class="nav-item">
                <router-link to="/login" class="nav-link">Login</router-link> <!--toggle login/logout for authenticated user-->
            </li>
        
        </ul>
      </div>
    </nav>
    `,
    
    data: function() {
        return {
            user_id: JSON.parse(sessionStorage.user_id),
        };
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

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
});

// __________________________________________________________________________________________________________________________________________________________________________________

const AllPosts = Vue.component('all-posts', {
    template: `
    <div class="post-container">
        <ul id="ul" v-if="messages">
                <li v-for="message in messages" class="messages">{{ message }}</li>
        </ul>
        <router-link to="/posts/new" class="btn btn-primary btn-addPost">New Post</router-link>
        <ul v-if="user_posts.length != 0">
            <li v-for="post in user_posts">
                <div v-on:dblclick="add_like" class="post card" :id="post.id">
                        <router-link :to="'/users/' + post.user_id" class="nav-link">
                            <h6 class="card-subtitle text-muted">
                                <img :src= "'/static/uploads/' + post.prof_pic" class="tiny" />
                                {{ post.username }}
                            </h6>
                        </router-link>
                    <div class="post-body card-body">
                        <img :src="'/static/uploads/' + post.photo" class="post-img" />
                        <p class="card-text">{{ post.caption }}</p>
                    </div>
                    <div class="post-footer text-muted">
                        <p style="float:left;" v-if="like_history(post.id)">
                        <img src="/static/icons/like.png" width="25" height="25" class="d-inline-block align-top" alt=""> {{ post.likes }} likes</p>
                        
                        <p style="float:left;" v-else>
                        <img src="/static/icons/like (3).png" width="25" height="25" class="d-inline-block align-top" alt=""> {{ post.likes }} likes</p>
                        
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
            console.log(jsonResponse);
            self.user_posts=jsonResponse.user_posts;
        });
        //--------------- fetch likes data for add feature used in like_history function ------------------
        fetch("/api/posts/"+ this.logged_in_user +"/likes")
            
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

        add_like: function(event){ //it works.....
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
                'Content-Type': 'application/json'
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
                    fetch('/api/posts')
        
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(jsonResponse) {
                        self.user_posts=jsonResponse.user_posts;
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
                <input type="file" name="photo" class="form-control">
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
                // display a success/error message
                console.log(jsonResponse);
                router.push({path:'/login'});
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

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
                console.log(jsonResponse);
                // self.message = jsonResponse.error; 

                if ('error' in jsonResponse){
                    self.messages = jsonResponse.error; 
                    // router.push("login");
                }else{
                    self.message = [];
                    router.push("explore");
                    // save user id in session
                    sessionStorage.user_id= JSON.stringify({"user_id":jsonResponse.id});
                    // logged_in = true; was tinking of using this to switch the login/logout in navbar but nah can delete
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
});

// __________________________________________________________________________________________________________________________________________________________________________________

const Logout = Vue.component('logout', {
    template: `
    <div>
        <h1 class="page-header">404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {};
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
                    <img :src= "'/static/uploads/' + user_posts[0].prof_pic" class="profile_pic" />
                </div>
                
                <div id="box2">
                        <h5 id="user_name" class="card-title">{{ user_posts[0].firstname }} {{ user_posts[0].lastname }}</h5>
                        <p id="location">{{ user_posts[0].location }}</p>
                        <p>Member since {{ user_posts[0].joined_on }}</p>
                        <p>{{ user_posts[0].bio }}</p>
                </div>
            </div>    
                <div id="box3" class="d-flex justify-content-between flex-column">
                    <div class="d-flex justify-content-between flex-row">
                    
                        <div class="d-flex flex-column align-items-center">
                            <h5>{{ user_posts[0].nPosts }}</h5>
                            <h6>Posts</h6>
                        </div>
                        <div class="d-flex flex-column align-items-center">
                            <h5 id="nfollowings">{{ user_posts[0].nFollows }}</h5>
                            <h6>Followers</h6>
                        </div>
                        
                    </div>
                    
                    <div v-if="followers(user_posts[0].user_id)">
                    <button class="btn btn-primary" id="follow-btn" @click="add_follow">Following</button>
                    </div>
                    
                    <div v-else>
                    <button class="btn btn-secondary" id="follow-btn" @click="add_follow">Follow</button>
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
            <router-link to="/posts/new" class="btn btn-primary">New Post</router-link>
        </div>
    </div>
    `,
    created: function() {
        let self = this;
        
        fetch("/api/users/" + this.user_id + "/posts")
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            console.log(jsonResponse);
            self.user_posts = jsonResponse.user_posts;
        });
        
        fetch("/api/posts/"+ this.logged_in_user +"/follows")
            
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            self.follows_log=(jsonResponse.followers);
            console.log(self.follows_log);
        });
    },
    
    data: function() {
        return {
            user_id: this.$route.params.user_id,
            user_posts: [],
            messages: [],
            logged_in_user: JSON.parse(sessionStorage.user_id)["user_id"],
            follows_log: []
        };
    },
    methods: {
        // follow: function(event) {
        //     let follow_btn;
        //     this.user_posts[0].nFollows += 1;
        //     follow_btn = document.getElementById("follow-btn");
        //     follow_btn.innerHTML = "Following";
        //     follow_btn.disabled = true;
            
            // Send follow to database
            
        // },
        
        add_follow: function(event){
            let self = this;
            let id = JSON.parse(sessionStorage.user_id);
            let follower_id = parseInt(id['user_id']);
            let user_id = parseInt(this.user_id);
            
            
            let follow_btn;
            // this.user_posts[0].nFollows += 1;
            follow_btn = document.getElementById("follow-btn");
            follow_btn.innerHTML = "Following";
            follow_btn.disabled = true;
            follow_num = document.getElementById("nfollowings");
            
            
            fetch("/api/users/"+ user_id +"/follow", {
            method: 'POST',
            body: JSON.stringify({follower_id: follower_id}),
            headers: {
                'X-CSRFToken': token,
                'Content-Type': 'application/json'
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
            
            
            fetch("/api/users/"+ user_id +"/follow", {
            method: 'GET',
            body: {},
            headers: {
                'X-CSRFToken': token,
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
            
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success/error message
                console.log(jsonResponse);
                
                follow_num.innerHTML = jsonResponse.followers;
                
            })
            .catch(function (error) {
                console.log(error);
            });
            
        },
        
        //function checks if a user already follows another user.
        followers: function(follower_id){
            let self = this;
            
            for(let x in this.follows_log){
                if(follower_id == this.follows_log[x].user_id){
                    return true;
                }
            }
        }
    }
});

// const MyProfile = Vue.component('my-profile', {
//     template: `
//     <div class="container" id="prof_container">
//         <ul id="ul" v-if="messages">
//             <li v-for="message in messages" class="messages">{{ message }}</li>
//         </ul>
//         <div class="card d-flex justify-content-between flex-row" id="box_container">
        
//             <div id="box0" class="d-flex justify-content-start flex-row">
//                 <div id="box1">
//                     <img :src= "'/static/uploads/' + user_info.prof_pic" class="profile_pic" />
//                 </div>
                
//                 <div id="box2">
//                         <h5 id="user_name" class="card-title">{{ user_info.firstname }} {{ user_info.lastname }}</h5>
//                         <p id="location">{{ user_info.location }}</p>
//                         <p>Member since {{ user_info.joined_on }}</p>
//                         <p>{{ user_info.bio }}</p>
//                 </div>
//             </div>    
//                 <div id="box3" class="d-flex justify-content-between flex-column">
//                     <div class="d-flex justify-content-between flex-row">
                    
//                         <div class="d-flex flex-column align-items-center">
//                             <h5>{{ user_info.nPosts }}</h5>
//                             <h6>Posts</h6>
//                         </div>
//                         <div class="d-flex flex-column align-items-center">
//                             <h5 id="nfollowings">{{ user_info.nFollows }}</h5>
//                             <h6>Followers</h6>
//                         </div>
                        
//                     </div>
//                     <button class="btn btn-secondary" id="follow-btn" @click="add_follow">Follow</button>
//                 </div>
//         </div>
        
//         <ul v-if="user_posts.length != 0" class="d-flex flex-row flex-sm-wrap" id="post_list">
//             <li v-for="post in user_posts" class="card">
//                 <img :src="'/static/uploads/' + post.photo" class="card-img"/>
//                 <div class="card-img-overlay"></div>
//             </li>
//         </ul>
//         <div v-else>
//             <p>Nothing to display yet</p>
//             <router-link to="/posts/new" class="btn btn-primary">New Post</router-link>
//         </div>
//     </div>
//     `,
//     created: function() {
//         let self = this;
        
//         fetch("/api/users/" + this.user_id + "/posts")
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(jsonResponse) {
//             console.log(jsonResponse);
//             self.user_posts = jsonResponse.user_posts;
//             self.user_info = jsonResponse.user_info;
//         });
//     },
//     data: function() {
//         return {
//             user_id: this.$route.params.user_id,
//             user_posts: [],
//             user_info: [],
//             messages: []
//         };
//     },
//     methods: {
//         // follow: function(event) {
//         //     let follow_btn;
//         //     this.user_posts[0].nFollows += 1;
//         //     follow_btn = document.getElementById("follow-btn");
//         //     follow_btn.innerHTML = "Following";
//         //     follow_btn.disabled = true;
            
//             // Send follow to database
            
//         // },
        
//         add_follow: function(event){
//             let self = this;
//             let id = JSON.parse(sessionStorage.user_id);
//             let follower_id = parseInt(id['user_id']);
//             let user_id = parseInt(this.user_id);
            
            
//             let follow_btn;
//             // this.user_posts[0].nFollows += 1;
//             follow_btn = document.getElementById("follow-btn");
//             follow_btn.innerHTML = "Following";
//             follow_btn.disabled = true;
//             follow_num = document.getElementById("nfollowings");
            
            
//             fetch("/api/users/"+ user_id +"/follow", {
//             method: 'POST',
//             body: JSON.stringify({follower_id: follower_id}),
//             headers: {
//                 'X-CSRFToken': token,
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'same-origin'
            
//             })
//             .then(function (response) {
//                 return response.json();
//             })
//             .then(function (jsonResponse) {
//                 // display a success/error message
//                 console.log(jsonResponse);
//                 if (jsonResponse.message) {
//                     self.messages = [];
//                     self.messages.push(jsonResponse.message);
//                     document.getElementById("ul").setAttribute('class', 'alert alert-success');
//                 }
//                 else {
//                     self.messages = [];
//                     for (var i = 0; i < jsonResponse.errors.length; i++) {
//                         self.messages.push(jsonResponse.errors[i]);
//                     }
//                     document.getElementById("ul").setAttribute('class', 'alert alert-danger');
//                 }
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
            
            
//             fetch("/api/users/"+ user_id +"/follow", {
//             method: 'GET',
//             body: {},
//             headers: {
//                 'X-CSRFToken': token,
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'same-origin'
            
//             })
//             .then(function (response) {
//                 return response.json();
//             })
//             .then(function (jsonResponse) {
//                 // display a success/error message
//                 console.log(jsonResponse);
                
//                 follow_num.innerHTML = jsonResponse.followers;
                
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
            
            
            
            
//         }
//     }
// });

// __________________________________________________________________________________________________________________________________________________________________________________

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