var React = require('react');

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
        router.navigate('timeline/', {trigger: true});
      },
      error: function(user, error){
        console.log(user, error);
      }
    });
  },
  render: function(){
    return(
      <div className="sign-in-container">
        <form id="signin" onSubmit={this.handleSubmit}>
          <div className="instructions">Sign Up!</div>
          <input className="form-control" name="email" id="email" type="email" placeholder="Email" />
          <input className="form-control" name="password" id="password" type="password" placeholder="Password" />
          <input className="btn login-button" type="submit" value="Sign Up" />
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
