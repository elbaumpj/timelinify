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
        <form id="login" className="col-xs-12 col-md-6" onSubmit={this.handleSubmit}>
          <div className="instructions">Login to your account</div>
          <input className="form-control login-field" name="email" id="email" type="email" placeholder="Email" />
          <input className="form-control login-field" name="password" id="password" type="password" placeholder="Password" />
          <input className="btn login-button" type="submit" value="Log In" />
      </form>
      <div className="col-xs-12 col-md-6 time-quote">
        <p>It takes a long time to become young.</p>
        <p>-Pablo Picasso</p>
      </div>
      </div>
    )
  }
});

var BannerComponent = React.createClass({
  render: function(){
    return(
      <div className="banner">
        <h2> <img src='../../images/timeline_icon.png' />Timelinify</h2>
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
        <div>
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
