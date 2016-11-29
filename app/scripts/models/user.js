//3rd party imports

var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');

//user model w/help from Jake

var User = Backbone.Model.extend({
  urlRoot: 'https://arkiver-beta.herokuapp.com/api/me',
  login: function(email, password, callbacks){
    var payload = {
      "user": {
        "email": email,
        "password": password
      }
    };
    // $.post("https://arkiver-beta.herokuapp.com/login", JSON.stringify(payload), function(resp){
    $.post("https://arkiver-beta.herokuapp.com/login", JSON.stringify(payload), function(resp){
      console.log("response from login:", resp);
      localStorage["logged_in"] = true;
      localStorage["user_token"] = resp.authentication_token;
      localStorage["user_email"] = email;


    }).success(function() {
      callbacks.success();
    }).fail(function() {
      callbacks.fail();
    });
    console.log(callbacks);
  },
  signup: function(email, password, callbacks){
    var payload = {
      "user": {
        "first_name": "User",
        "last_name": "Johnson",
        "email": email,
        "password": password,
        "password_confirmation": password
      },
      "origin": "web"
    };
    // $.post("https://arkiver-beta.herokuapp.com/login", JSON.stringify(payload), function(resp){
    $.post("https://arkiver-beta.herokuapp.com/signup", JSON.stringify(payload), function(resp){
      console.log("response from login:", resp);
      localStorage["logged_in"] = true;
      localStorage["user_token"] = resp.authentication_token;
      localStorage["user_email"] = email;


    }).success(function() {
      callbacks.success();
    }).fail(function() {
      callbacks.fail();
    });
    console.log(callbacks);
  }
});

module.exports = {
  User: User
};
