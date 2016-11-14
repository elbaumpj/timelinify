var React = require('react');




var SignUpComponent = React.createClass({
  render: function(){
    return(
      <div className="sign-in-container">
        <form id="signin">
          <input className="form-control" name="email" id="email" type="email" placeholder="Email" />
          <input className="form-control" name="password" id="password" type="password" placeholder="Password" />
          <input className="btn login-button" type="submit" value="Sign Up" />
      </form>
      </div>
    )
  }
});



var LoginContainer = React.createClass({
  render: function(){
    return (
      <SignUpComponent />
      <SignInComponent />
    )
  }
});
