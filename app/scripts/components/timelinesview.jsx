var React = require('react');
var Backbone = require('backbone');
//local imports
var models = require('../models/timeline');




var TimelineListViewContainer = React.createClass({
  createTimeline: function(){
    var newTimeLine = new models.Timeline()
    newTimeLine.set("title", "cool dude")
    newTimeLine.save({title: "cool timeline"},{
      success: function(resp) {
        console.log("hooray", resp);
      },
      error: function(err, resp) {
        console.log("something aint right:", err);
      }
    }).then(function(){
      Backbone.history.navigate('timeline/' + newTimeLine.get('id') + '/', {trigger: true});
    });
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
  TimelineListViewContainer: TimelineListViewContainer
}
