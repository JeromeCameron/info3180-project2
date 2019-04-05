Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color:#8134d4">
      <a class="navbar-brand" href="{{ url_for('home') }}">
        <img src="{{ url_for('static', filename="icons/photograph.png") }}" width="25" height="25" class="d-inline-block align-top" alt="">
        Photogram
      </a>
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
    
          {% if 5==4 %} <!--TODO Change to check if current user is authenticated i.e. if current_user.is_authenticated-->
            <li class="nav-item">
              <router-link to="/logout" class="nav-link">Logout</router-link>
            </li>
          {% else %}
            <li class="nav-item">
              <router-link to="/login" class="nav-link">Explore</router-link>
            </li>
          {% endif %}
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

const AllPosts = Vue.component('all-posts', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
    }
});

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

const ProfileForm = Vue.component('profile-form', {
    template: `
    <form @submit.prevent="uploadPhoto" method='post' encType="multipart/form-data" id="uploadForm">
        <h2>Upload a Photo</h2>
        <ul id="ul" v-if="messages">
            <li v-for="message in messages" class="messages">{{ message }}</li>
        </ul>
        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" class="form-control"></textarea>
        </div>
        <div class="form-group">
            <label for="photo">Upload Photo</label>
            <input class="form-control" type="file" name="photo" accept="image/*">
        </div>
        
        <button type="submit" name="submit" class="btn btn-primary">Submit</button>
    </form>
    <h1 class="page-header">Add Profile</h1>
{% include 'flash_messages.html' %}
<div class="users">
    <form method="post" action="{{ url_for('profile') }}" enctype="multipart/form-data">
        {{ form.csrf_token }}
        <div class="form-group">
            {{ form.firstname.label }} {{ form.firstname(class="form-control") }}
        </div>
        <div class="form-group">
            {{ form.lastname.label }} {{ form.lastname(class="form-control") }}
        </div>
        
        <div class="form-group">
            {{ form.gender.label }} {{ form.gender(class="form-control") }}
        </div>
        
        <div class="form-group">
            {{ form.email.label }} {{ form.email(class="form-control", placeholder="e.g. jonathandoe@example.com") }}
        </div>
        <div class="form-group">
            {{ form.location.label }} {{ form.location(class="form-control", placeholder="e.g. Kingston, Jamaica") }}
        </div>
        <div class="form-group">
            {{ form.bio.label }} {{ form.bio(class="form-control") }}
        </div>
    
        <div class="form-group">
            {{ form.photo.label }} {{ form.photo(class="form-control") }}
        </div>
    
        <button type="submit" class="btn btn-primary">Add Profile</button>
    </form>
</div>
    `,
    data: function() {
        return {
            messages: [],
        }
    },
    methods: {
        uploadPhoto: function() {
        let self = this;
        let uploadForm = document.getElementById('uploadForm');
        let form_data = new FormData(uploadForm);
        
        fetch("/api/upload", {
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

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: AllPosts},
        {path: "/register", component: ProfileForm },
        {path: "/login", component: LoginForm },
        {path: "/login", component: Logout },
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