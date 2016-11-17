var React = require('react');
var $ = require('jquery');

//local imports
var User = require('../models/user').User;

var SignInComponent = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();

    var router = this.props.router;
    var user = new User();

    user.login(email, password, {
      success: function(user) {
        console.log("user in success callback",user);
        router.navigate('timelines/', {trigger: true});
      },
      error: function(user, error){
        console.log(user, error);
      }
    });
  },
  render: function(){
    return(
      <div className="log-in-container">
        <form id="login" onSubmit={this.handleSubmit}>
          <div className="instructions">Login to your account</div>
          <input className="form-control" name="email" id="email" type="email" placeholder="Email" />
          <input className="form-control" name="password" id="password" type="password" placeholder="Password" />
          <input className="btn login-button" type="submit" value="Log In" />
      </form>
      </div>
    )
  }
});

var BannerComponent = React.createClass({
  render: function(){
    return(
      <div className="banner">
        <h2>Timelinify</h2>
      </div>
    )
  }
});



var LoginContainer = React.createClass({
  render: function(){
    return (
      <div>
        <div className="col-md-12 clearfix">
          <BannerComponent />
        </div>
        <div>
        <div className="col-md-4">
          <SignInComponent router={this.props.router} />
        </div>
        </div>
      </div>
    )
  }
});

module.exports = {
  LoginContainer: LoginContainer
}
