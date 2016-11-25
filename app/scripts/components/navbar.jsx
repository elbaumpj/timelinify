var React = require('react');
var Backbone = require('backbone');
//Nav components

var NavTemplate = React.createClass({
  navToLogin: function(){
    Backbone.history.navigate('#/', {trigger: true});
  },
  navToTimelines: function(){
    Backbone.history.navigate('timelines/', {trigger: true});
  },
  render: function(){
    return(
      <nav className="navbar navbar-default">
        <h3 className="title-header"> <img src='../../dist/images/timeline_icon.png' /> Timelinify</h3>
        <div>
          <span className="nav-spans" onClick={this.navToLogin}>Login</span>&nbsp; &nbsp;
          <span className="nav-spans" onClick={this.navToTimelines}> Your Timelines</span>
        </div>
      </nav>
    )
  }
});


module.exports = {
  NavTemplate: NavTemplate
}
