var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Popover = require('react-bootstrap').Popover;
var Tooltip = require('react-bootstrap').Tooltip;
var React = require('react');
var $ = require('jquery');
var moment = require('moment');
//local imports
var ScrapbookCollection = require('../models/scrapbook').ScrapbookCollection;
var MomentCollection = require('../models/scrapbook').MomentCollection;
var models = require('../models/timeline');
//components

var TimelineEvent = React.createClass({
  // getInitialState: function(){
  //   return this.props.eventItem.toJSON();
  // },
  deleteEvent: function(){
    console.log('is this a model?', this.props.eventItem.urlRoot);
    console.log('id', this.props.timelineId);
    this.props.eventItem.destroy({
      success: function(resp){
        console.log("event #",resp, "was destroyed");
      }
    })
    // this.props.eventCollection.timelineId = this.props.timelineId
    // this.props.showEvent(this.props.eventCollection);
  },
  setEventDate: function(){

  },
  getHistoricalData: function(){
    var historicalData = new models.HistoricalData();
    historicalData.fetch();
  },
  render: function(){
    //need to set value on date input to format YYYY-MM-DD and need an onChange to set event's date to new date
    return(
      <li className="timeline-event well">
        <img src={this.props.image} />
        <br />
        <p>{this.props.eventItem.get('description')}</p>
        <input className="event-date" type="date" onChange={this.setEventDate} />
        <br />
        <button type="button" className="btn" onClick={this.getHistoricalData}>This Day in History</button>
        <button type="button" className="btn btn-danger" onClick={this.deleteEvent}>Delete</button>
        <button type="button" className="btn" onClick={this.props.saveEvent}>Save</button>
      </li>
    )
  }
});

var TimelineEventComponent = React.createClass({
  // deleteEvent: function(event){
  //   event.destroy({
  //     success: function(resp){
  //       console.log("event #",resp, "was destroyed");
  //     }
  //   })
  //   this.props.showEvent(this.props.eventCollection);
  // },
  saveEvent: function(){
    // console.log('event description', this.props.event.get('description'));
    // console.log($('.event-date').val());
  },
  generateItems: function(){
    var self = this;
    return this.props.eventCollection.map(function(event){
      console.log(event);
        return <TimelineEvent key={event.cid} timelineId={self.props.timelineId} updateEventCollection={self.props.updateEventCollection} saveEvent={self.saveEvent} image={event.get('moment').dropbox_path} description={event.get('description')} eventItem={event} eventCollection={self.props.eventCollection}/>
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
    console.log('creating event', timelineId);
    event.timelineId = timelineId;
    event.set({
      title: "test",
      description: "",
      date: moment(this.props.moment.get('given_date'))._d,
      moment_id: this.props.moment.get('id')
    })

    var self = this;
    event.save().then(function(){
      console.log('fetch after save', self.props.eventCollection);
    });

    this.props.eventCollection.add(event);

    console.log(event);


    // this.props.updateEventCollection(this.props.eventCollection); //was causing a undefined on the map
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
            <MomentThumbnailComponent eventCollection={self.props.eventCollection} key={moment.cid} updateEventCollection={self.props.updateEventCollection} timelineId={self.props.timelineId} moment={moment} />
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
              <Button onClick={this.props.navToScrapbook}>Back</Button>
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
  updateEventCollection: function(newEventCollection){
    // this.state.eventCollection.timelineId = this.props.timelineId;
    this.setState({eventCollection: newEventCollection});
    console.log('updating event collection method', this.state.eventCollection);
  },
  saveTimeline: function(e){
    e.preventDefault();
    var timeline = new models.Timeline();
    var id = this.props.timelineId;
    timeline.set("id", id);
    timeline.url = 'https://arkiver-beta.herokuapp.com/api/timelines' + '/' + id;
    var timelineName = $('#timeline-name').val();
    var timelineDescription = $('#timeline-description').val();
    timeline.save({
      title: timelineName,
      description: timelineDescription
    });
  },
  componentWillMount: function(){
    var self = this;
    this.state.eventCollection.timelineId = this.props.timelineId;
    this.state.eventCollection.fetch().then(function(){
      self.setState({eventCollection: self.state.eventCollection}); //dan suggests setting eventCollection to itself and pass that
    });
  },
  render: function(){
      return(
        <div>

            <input type="text" id="timeline-name" placeholder="Timeline Name" />
            <input type="text" id="timeline-description" placeholder="Timeline Description" />
            <button type="submit" className="btn" onClick={this.saveTimeline}>Update Timeline</button>

          <div>
            <ModalComponent eventCollection={this.state.eventCollection} updateEventCollection={this.updateEventCollection} timelineId={this.props.timelineId} displayType={this.state.displayType} collection={this.state.collection} viewMoments={this.viewMoments} />
          </div>
            <TimelineEventComponent timelineId={this.props.timelineId} updateEventCollection={this.updateEventCollection} eventCollection={this.state.eventCollection} />
        </div>
      )
    }
});


module.exports = {
  TimelineContainer: TimelineContainer
}
