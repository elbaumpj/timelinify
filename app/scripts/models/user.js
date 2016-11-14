//3rd party imports

var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');

//user model w/help from Jake

var User = Backbone.Model.extend({
  urlRoot: 'https://arkiver.com/api/me',
  login: function(email, password, callbacks){
    var payload = {
      "user": {
        "email": email,
        "password": password
      }
    };
    $.post("https://arkiver.com/login", JSON.stringify(payload), function(resp){

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
