var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Popover = require('react-bootstrap').Popover;
var Tooltip = require('react-bootstrap').Tooltip;
var React = require('react');
var $ = require('jquery');

//local imports
var ScrapbookCollection = require('../models/scrapbook').ScrapbookCollection;
var MomentCollection = require('../models/scrapbook').MomentCollection;
var models = require('../models/timeline');
//components

var TimelineEvent = React.createClass({
  deleteEvent: function(){
    this.props.eventItem.destroy({
      success: function(resp){
        console.log("event #",resp, "was destroyed");
      }
    })
    this.props.updateEventState(this.props.event);
  },
  getHistoricalData: function(){
    var historicalData = new models.HistoricalData();
    historicalData.fetch();
  },
  render: function(){
    return(
      <li className="timeline-event well">
        <img src={this.props.image} />
        <br />
        <input type="date" />
        <br />
        <button type="button" className="btn" onClick={this.getHistoricalData}>This Day in History</button>
        <button type="button" className="btn btn-danger" onClick={this.deleteEvent}>Delete</button>
      </li>
    )
  }
});

var TimelineEventComponent = React.createClass({
  generateItems: function(){
    var self = this;
    return this.props.event.map(function(pic){
      return <TimelineEvent key={pic.cid} updateEventState={self.props.updateEventState} image={pic.attributes.imageSource} description={pic.attributes.description} eventItem={pic} event={self.props.event}/>
    });
  },
  render: function(){
      var pictures = this.generateItems();
    return(
      <ul className="timeline timeline-events-container">
      {pictures}
     </ul>
    )
  }
});

var MomentThumbnailComponent = React.createClass({
  createEvent: function(timelineId){
    var event = new models.Event();
    event.timelineId = timelineId;
    event.set({
      title: "test",
      imageSource: this.props.moment.get('thumbnail_url'),
      description: "",
      date: this.props.moment.get('given_date'),
      moment_id: this.props.moment.get('id')
    })

    var self = this;
    event.save().then(function(){
      console.log('fetch after save', self.props.eventCollection);
    });


    console.log(event);
    // var fetchedEvents = this.props.eventCollection.fetch();
    // console.log(fetchedEvents);
    // console.log('fetching all events for this timeline', this.props.eventCollection);
    this.props.showEvent(event);
  },
  render: function(){
    var self = this;
    return(
      <div className="thumbnail" onClick={function(){self.createEvent(self.props.timelineId)}}>
        <img src={this.props.moment.attributes.thumbnail_url} />
      </div>
    )
  }
});


var ScrapbookThumbnailComponent = React.createClass({
  viewMoments: function(){
    this.props.viewMoments(this.props.scrapbook.id);
  },
  render: function(){
    return(
      <div className="thumbnail" onClick={this.viewMoments}>
        <img src={this.props.scrapbook.cover} />
        <p>{this.props.scrapbook.title}</p>
      </div>
    )
  }
});

var ModalComponent = React.createClass({
  getInitialState: function() {
      return {showModal: false};
    },
    close: function() {
      this.setState({ showModal: false });
    },

    open: function() {
      this.setState({ showModal: true });
    },

    render: function() {
      var self = this
      const popover = (
        <Popover id="modal-popover" title="popover">
          very popover. such engagement
        </Popover>
      );
      const tooltip = (
        <Tooltip id="modal-tooltip">
          wow.
        </Tooltip>
      );

      var self = this;
      var pictureThumbnails;
      if(this.props.displayType == 'scrapbook'){
        var pictureThumbnails = this.props.collection.models.map(function(collection){
          return (
            <ScrapbookThumbnailComponent key={collection.id} scrapbook={collection} viewMoments={self.props.viewMoments}/>
          )
        });
      } else {
        var pictureThumbnails = this.props.collection.models.map(function(moment){
          return (
            <MomentThumbnailComponent eventCollection={self.props.eventCollection} key={moment.cid} showEvent={self.props.showEvent} timelineId={self.props.timelineId} moment={moment} />
            )
      });
    }
      return (
        <div>
          <i className="add-button fa fa-plus-circle" aria-hidden="true" onClick={this.open}></i>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Arkiver Collections</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              {pictureThumbnails}

            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
              <Button onClick={function(){self.props.collection.getNextSet()}}>Next</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
  }
});

var TimelineContainer = React.createClass({
  getInitialState: function(){
    return {
      collection: new ScrapbookCollection(),
      displayType: 'scrapbook',
      eventCollection: new models.EventCollection(),
      event: []
    };
  },
  componentDidMount: function(){
    var collection = this.state.collection;

    collection.fetch().then(function(resp){
        console.log('collection fetched, resp is ', resp);
        collection.url = "https://arkiver-beta.herokuapp.com"+collection.models[0].get("links").next;
        collection.models = collection.models[0].get("collections");
      });
  },
  viewMoments: function(scrapbookId){
    console.log(scrapbookId);
    var moments = new MomentCollection();
    moments.scrapbookId = scrapbookId;
    var self = this;
    moments.fetch().then(function(){
      self.setState({displayType: 'moment', collection: moments});
    });
  },
  showEvent: function(event){
    var eventArray = this.state.event;
    eventArray.push(event)
    this.setState({event: eventArray});
    console.log(this.state.eventCollection);
  },
  saveTimeline: function(e){
    e.preventDefault();
    var timeline = new models.Timeline();
    var id = this.props.timelineId;
    timeline.url = 'https://arkiver-beta.herokuapp.com/api/timelines' + '/' + id;
    var timelineName = $('#timeline-name').val();
    var timelineDescription = $('#timeline-description').val();
    console.log(timelineName);
    console.log(timelineDescription);
    // timeline.set({
    //   title: timelineName,
    //   description: timelineDescription
    // });
    timeline.save({
      title: timelineName,
      description: timelineDescription
    });
    console.log(timeline);
  },
  componentWillMount: function(){
    this.state.eventCollection.timelineId = this.props.timelineId;
    this.state.eventCollection.fetch();
    console.log(this.state.eventCollection);
    this.setState({event: this.state.eventCollection.models}); //assuming that eventCollection comes back as an array
  },
  updateEventState: function(newEventState) {
    this.setState({event: newEventState});
  },
  render: function(){
      return(
        <div>

            <input type="text" id="timeline-name" placeholder="Timeline Name" />
            <input type="text" id="timeline-description" placeholder="Timeline Description" />
            <button type="submit" className="btn" onClick={this.saveTimeline}>Update Timeline</button>

          <div>
            <ModalComponent eventCollection={this.state.eventCollection} showEvent={this.showEvent} timelineId={this.props.timelineId} displayType={this.state.displayType} collection={this.state.collection} viewMoments={this.viewMoments} />
          </div>
            <TimelineEventComponent event={this.state.event} updateEventState={this.updateEventState}/>
        </div>
      )
    }
});


module.exports = {
  TimelineContainer: TimelineContainer
}
