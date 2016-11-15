//3rd party imports
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

//local imports
var LoginContainer = require('./components/login.jsx').LoginContainer;
var SignUpContainer = require('./components/signup.jsx').SignUpContainer;
var TimelineContainer = require('./components/timeline.jsx').TimelineContainer;

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
  routes: {
    '': 'index',
    'signup/': 'signup',
    'timeline/': 'timeline'
  },
  initialize: function(){
    $.ajaxSetup({
      headers : {
        "Accept": "application/json,version=2",
        "Content-Type": "application/json",
        "Authorization": "Token token=cb312c5dfea2869df465be179f391292"
      }
    });
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
          options.url = options.url + "&user_email=" + authData.user_email + "&user_token=" + authData.user_token;
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
    ReactDOM.render(
      React.createElement(LoginContainer, {router: this}),
      document.getElementById('app')
    );
  },
  signup: function(){
    ReactDOM.render(
      React.createElement(SignUpContainer, {router: this}),
      document.getElementById('app')
    );
  },
  timeline: function(){
    ReactDOM.render(
      React.createElement(TimelineContainer),
      document.getElementById('app')
    );
  }
});

var router = new AppRouter();

module.exports = router;
