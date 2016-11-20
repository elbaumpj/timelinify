//3rd party imports
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

//local imports
var LoginContainer = require('./components/login.jsx').LoginContainer;
var SignUpContainer = require('./components/signup.jsx').SignUpContainer;
var TimelineContainer = require('./components/timeline.jsx').TimelineContainer;
var TimelineListViewContainer = require('./components/timelinesview.jsx').TimelineListViewContainer;
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
    'timeline/:id/': 'timeline',
    'timelines/': 'timelinesview'
  },
  initialize: function(){
    $.ajaxSetup({
      headers: {
        "Accept": "application/json,version=2",
        "Content-Type": "application/json",
        'Authorization': 'Token token=a9e757198b0339c5441cea4cbe8cd51a'
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

        //to get around prefilter for 3rd party
        if(options.url == 'http://history.muffinlabs.com/date') {
          options.url == options.url;
        }

        else if(options.url.split("?").length > 1) {
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
  timeline: function(timelineId){
    ReactDOM.render(
      React.createElement(TimelineContainer, {timelineId: timelineId}),
      document.getElementById('app')
    );
  },
  timelinesview: function(){
    ReactDOM.render(
      React.createElement(TimelineListViewContainer),
      document.getElementById('app')
    );
  }
});

var router = new AppRouter();

module.exports = router;
