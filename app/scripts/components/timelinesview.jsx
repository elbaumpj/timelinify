var React = require('react');
var Backbone = require('backbone');
//local imports
var models = require('../models/timeline');




var TimelineViewContainer = React.createClass({
  getInitialState: function(){
    return{
      timeline: new models.Timeline()
    };
  },
  createTimeline: function(){
    console.log(this.state.timeline);
    var newTimeLine = new models.Timeline()
    newTimeLine.save();

  },
  render: function(){
    return(
      <div>
        <h1>View and Create Timelines</h1>
        <input className="btn" type="submit" value="Create a New Timeline" onClick={this.createTimeline}/>
      </div>
    )
  }
});


module.exports = {
  TimelineViewContainer: TimelineViewContainer
}
