var React = require('react');
var $ = require('jquery');
var User = require('../models/user').User;

var SignUpComponent = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();

    var router = this.props.router;
    var user = new User();

    user.login(email, password, {
      success: function(user) {
        console.log(user);
        router.navigate('timelines/', {trigger: true});
      },
      error: function(user, error){
        console.log(user, error);
      }
    });
  },
  render: function(){
    return(
      <div className="sign-in-container">
        <form id="login" className="col-xs-12 col-md-6" onSubmit={this.handleSubmit}>
          <div className="instructions">Sign up for an account</div>
          <input className="form-control login-field" name="email" id="email" type="email" placeholder="Email" />
          <input className="form-control login-field" name="password" id="password" type="password" placeholder="Password" />
          <input className="btn login-button" type="submit" value="Log In" />
      </form>
      </div>
    )
  }
});



var SignUpContainer = React.createClass({
  render: function(){
    return(
      <div>
        <SignUpComponent router={this.props.router} />
      </div>
    )
  }
});


module.exports = {
  SignUpContainer: SignUpContainer
}
