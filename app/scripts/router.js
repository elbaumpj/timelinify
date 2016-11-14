//3rd party imports
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

//local imports
var LoginContainer = require('./components/login.jsx').LoginComponent;

//router

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index'
  },
  index: function(){
    ReactDOM.render(
      React.createElement(LoginContainer),
      document.getElementById('app')
    );
  }
});

var router = new AppRouter();

module.exports = router;
