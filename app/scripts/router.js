//3rd party imports
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

//local imports
var LoginContainer = require('./components/login.jsx').LoginContainer;
var SignUpContainer = require('./components/signup.jsx').SignUpContainer;
var ModalContainer = require('./components/timeline.jsx').ModalContainer;

//see if user is logged in. if not, will use this to redirect to login screen

function userIsLoggedIn(){
  if (localStorage["user_email"] && localStorage["user_token"]){
    return true;
  }else{
    return false;
  }
}

//router

var AppRouter = Backbone.Router.extend({
  initialize: function() {
    console.log("BAAAAAAAA");
  },
  routes: {
    '': 'index',
    'signup/': 'signup',
    'timeline/': 'timeline'
  },
  execute: function(routeMethod, args){
    $(window).scrollTop(0,0);

    if(userIsLoggedIn()){

      $.ajaxPrefilter(function(options, originalOptions, jqXHR){

        originalOptions.data = originalOptions.data || {};

        var authData = {
          user_email: localStorage["user_email"],
          user_token: localStorage["user_token"]
        }

        if(options.url.split("?").length > 1) {
          options.url = options.url + "user_email=" + authData.user_email + "&user_token=" + authData.user_token;
        } else {
          options.url = options.url + "?user_email=" + authData.user_email + "&user_token=" + authData.user_token;
        }
      });
    } else if(routeMethod.name != 'index') {
      this.navigate('', {trigger: true});
      return false;
    }

    routeMethod.apply(this, args);
  },
  index: function(){
    console.log("CHHHHHHA");
    ReactDOM.render(
      React.createElement(LoginContainer, {router: this}),
      document.getElementById('app')
    );
  },
  signup: function(){
    console.log("DHHHHHHA");
    ReactDOM.render(
      React.createElement(SignUpContainer, {router: this}),
      document.getElementById('app')
    );
  },
  timeline: function(){
    ReactDOM.render(
      React.createElement(ModalContainer),
      document.getElementById('app')
    );
  }
});

var router = new AppRouter();

module.exports = router;
