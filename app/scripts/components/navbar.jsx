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
      <div>
        <div className="nav-spans-container">
          <span className="nav-spans" onClick={this.navToLogin}>Logout</span>&nbsp; &nbsp;
          <span className="nav-spans" onClick={this.navToTimelines}>Timelines</span>
        </div>
        <nav className="navbar navbar-default">
          <h3 className="title-header"> <img src='../../images/timeline_icon.png' /> Timelinify</h3>
        </nav>
      </div>
    )
  }
});


module.exports = {
  NavTemplate: NavTemplate
}
