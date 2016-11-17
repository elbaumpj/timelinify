var React = require('react');
var Backbone = require('backbone');
//local imports
var models = require('../models/timeline');



var ListItem = React.createClass({
  deleteTimeline: function(){
    this.props.timeline.destroy({
      success: function(resp){
        console.log(resp, "was destroyed");
      }
    })
  },
  render: function(){
    var timeline = this.props.timeline;
    return(
      <div>
        <a href={'#timeline/' + timeline.get('id') + '/'} className="list-group-item">Timeline #{timeline.get('id')}</a>
        <button type="button" className="btn btn-danger" onClick={this.deleteTimeline}>Delete</button>
      </div>
    )
  }
});

var TimelineList = React.createClass({
  render: function(){
    var timelines = this.props.timelineCollection;
    var timelineList = timelines.map(function(timeline){
      return <ListItem key={timeline.cid} timeline={timeline}/>
    });
    return(
      <div className>
        {timelineList}
      </div>
    )
  }
});

var TimelineListViewContainer = React.createClass({
  getInitialState: function(){
    return {
      timelineCollection : new models.TimelineCollection()
    }
  },
  componentWillMount: function(){
    var self = this;
    var timelineCollection = this.state.timelineCollection;
    timelineCollection.fetch().then(function(response){
      self.setState({timelineCollection: timelineCollection});
    });
  },
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
        <h1>View and Create Your Timelines</h1>
        <input className="btn" type="submit" value="Create a New Timeline" onClick={this.createTimeline}/>
        <TimelineList timelineCollection={this.state.timelineCollection}/>
      </div>
    )
  }
});


module.exports = {
  TimelineListViewContainer: TimelineListViewContainer
}
