var React = require('react');
var Backbone = require('backbone');
//local imports
var models = require('../models/timeline');



var ListItem = React.createClass({
  navToTimeline: function(){
    Backbone.history.navigate('#timeline/' + this.props.timeline.get('id') + '/', {trigger: true});
  },
  deleteTimeline: function(){
    this.props.timeline.destroy({
      success: function(resp){
        console.log(resp, "was destroyed");
      }
    })
  },
  render: function(){
    var events = this.props.timeline.get('events');
    console.log(this.props.timeline.get('events'));

    var eventPhotos = events.map(function(event){
      return <img key={event.id} src={event.moment.thumbnail_url} />
    });
    return(
      <div>
        {eventPhotos}
        <br />
        <div className="timeline-list-info">
          <h5 className="timeline-title-description title">{this.props.timeline.get('title')}</h5>
          <p className="timeline-title-description">{this.props.timeline.get('description')}</p>
        </div>
        <div className="timeline-buttons">
          <button type="button" className="btn delete-button" onClick={this.deleteTimeline}>Delete</button>
          <button type="button" className="btn login-button" onClick={this.navToTimeline}>View and Edit</button>
        </div>
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
      <div className="col-sm-12">
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
        <h2 className="timeline-title-description center">View and Create Your Timelines</h2>
        <input className="btn login-button center-button" type="submit" value="Create a New Timeline" onClick={this.createTimeline}/>
        <TimelineList timelineCollection={this.state.timelineCollection}/>
      </div>
    )
  }
});


module.exports = {
  TimelineListViewContainer: TimelineListViewContainer
}
