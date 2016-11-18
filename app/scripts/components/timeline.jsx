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
  render: function(){
    return(
      <li className="timeline-event well">
        <img src={this.props.image} />
      </li>
    )
  }
});

var TimelineEventComponent = React.createClass({
  generateItems: function(){
    return this.props.event.map(function(pic){
      return <TimelineEvent key={pic.cid} image={pic.attributes.imageSource} description={pic.attributes.description}/>
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
      imageSource: this.props.moment.attributes.thumbnail_url,
      description: "",
      date: this.props.moment.attributes.given_date,
      moment_id: this.props.moment.get('id')
    })
    event.save();
    console.log(event);
    this.props.postEvent(event);
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
            <MomentThumbnailComponent key={moment.cid} postEvent={self.props.postEvent} timelineId={self.props.timelineId} moment={moment} />
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
  postEvent: function(event){
    var eventArray = this.state.event;
    eventArray.push(event)
    this.setState({event: eventArray});
    console.log(this.state.event);
  },
  // saveTimeline: function(){
  //   var timeline = new models.Timeline();
  //   var urlRoot = 'https://arkiver-beta.herokuapp.com/api/timelines';
  //   timeline.urlRoot = urlRoot + '/' + this.props.timelineId;
  //   console.log(timeline);
  //   timeline.set({
  //     events: this.state.event
  //   })
  //   timeline.save();
  // },
  render: function(){
      return(
        <div>
          <button type="button" className="btn" onClick={this.saveTimeline}>Update Timeline</button>
          <div>
            <ModalComponent postEvent={this.postEvent} timelineId={this.props.timelineId} displayType={this.state.displayType} collection={this.state.collection} viewMoments={this.viewMoments} />
          </div>
            <TimelineEventComponent event={this.state.event}/>
        </div>
      )
    }
});


module.exports = {
  TimelineContainer: TimelineContainer
}
