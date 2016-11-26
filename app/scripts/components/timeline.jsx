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
var NavTemplate = require('./navbar.jsx').NavTemplate;
//components

var TimelineEvent = React.createClass({
  getInitialState: function(){
    return this.props.eventItem.toJSON();
  },
  deleteEvent: function(){
    this.props.eventItem.timelineId = this.props.timelineId;
    this.props.eventItem.destroy({
      success: function(resp){
        console.log("event #",resp, "was destroyed");
      }
    })
    this.props.updateEventCollection(this.props.eventCollection);
  },
  setEventDate: function(e){
    this.props.eventItem.timelineId = this.props.timelineId;
    this.props.eventItem.set({
      date: e.target.value
    })
    this.props.eventItem.save();
    this.props.updateEventCollection(this.props.eventCollection);
  },
  setDescription: function(e){
    this.props.eventItem.timelineId = this.props.timelineId;
    this.props.eventItem.set({
      description: e.target.value
    })
    this.props.eventItem.save();
    this.props.updateEventCollection(this.props.eventCollection);
  },
  getHistoricalData: function(){
    var input = this.props.eventItem.get('date');
    var d = new Date(input);

    var month = d.getMonth() + 1;
    var day = d.getDate() + 1;
    console.log(month, day);

    var self = this;

    $.ajax({
      url:'http://history.muffinlabs.com/date/' + month + '/' + day,
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
        format: 'json'
      },
      success: function(response){
        var events = response.data.Events.length
        var randomEvent = Math.floor(Math.random() * events);
        var year = response.data.Events[randomEvent].year;
        self.props.eventItem.timelineId = self.props.timelineId;
        self.props.eventItem.set({
          description: year + ': ' + response.data.Events[randomEvent].text
        });
        self.props.eventItem.save();
        self.props.updateEventCollection(self.props.eventCollection);
      }
    })

    // if (!!d.valueOf()){
    //   var year = d.getFullYear();
    //   var month = d.getMonth();
    //   console.log(month);
    //   var day = d.getDate();
    //   console.log(day);
    // }

    // var self = this;
    //
    // var historicalData = new models.HistoricalData();
    // historicalData.set({
    //   month: month,
    //   day: day
    // })
    //
    // historicalData.fetch().then(function(){
    //   console.log(historicalData);
    //   self.props.eventItem.set({
    //   description: historicalData.get('year') + ': ' + historicalData.get('text')
    // });
    //   self.props.eventItem.timelineId = self.props.timelineId;
    //   self.props.eventItem.save();
    //   self.props.updateEventCollection(self.props.eventCollection);
    // });

  },
  render: function(){
    //need to set value on date input to format YYYY-MM-DD and need an onChange to set event's date to new date
    return(
      <li className="timeline-event well">
        <img src={this.props.image} />
        <br />
        <p className="event-description">{this.props.eventItem.get('description')}</p>

        <input className="event-date" type="date" onChange={this.setEventDate} value={this.props.eventItem.get('date')} />
        <input className="event=description" type="text" placeholder="Description" onChange={this.setDescription}></input>
        <br />
        <button type="button" className="btn login-button" onClick={this.getHistoricalData}>This Day in History</button>
        <button type="button" className="btn delete-button" onClick={this.deleteEvent}>Delete</button>
      </li>
    )
  }
});

var TimelineEventComponent = React.createClass({
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
    console.log('creating event here', timelineId);
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


    this.props.updateEventCollection(this.props.eventCollection);
  },
  render: function(){
    var self = this;
    return(
      <div className="thumbnail" onClick={function(){self.createEvent(self.props.timelineId)}}>
        <img src={this.props.moment.get('thumbnail_url')} />
      </div>
    )
  }
});


var ScrapbookThumbnailComponent = React.createClass({
  viewMoments: function(){
    this.props.viewMoments(this.props.scrapbook.id);
  },
  render: function(){
    var cover;
    if (this.props.scrapbook.get('cover')) {
      cover = this.props.scrapbook.get('cover');
    }
    return(
      <div className="thumbnail" onClick={this.viewMoments}>
        <img src={cover}/>
        <p>{this.props.scrapbook.get('title')}</p>
      </div>
    )
  }
});

var ModalComponent = React.createClass({
  getInitialState: function() {
      return {
        showModal: false,
        collections: this.props.collection
      };
    },

    close: function() {
      this.setState({ showModal: false });
    },

    componentDidMount: function() {
      this.props.collection.on("add", () => {
        this.setState({
          collections: this.props.collection
        })
      })
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
        console.log("COLLECTION:", this.props.collection);
        console.log("length:", this.props.collection.models.length);
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
              <Button onClick={function(){self.props.collection.getNextSet()}}>More</Button>
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
      titleHeader: '',
      descriptionHeader: ''
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
      self.setState({eventCollection: self.state.eventCollection});
    });

    var timeline = new models.Timeline();
    var id = this.props.timelineId;
    timeline.set("id", id);
    timeline.url = 'https://arkiver-beta.herokuapp.com/api/timelines' + '/' + id;

    var self = this;
    timeline.fetch().then(function(){
      self.setState({titleHeader: timeline.get('title')});
      self.setState({descriptionHeader: timeline.get('description')});
    });
  },
  render: function(){
      return(
        <div>
            <NavTemplate />
            <div>
              <input type="text" id="timeline-name" placeholder="Timeline Name" />
              <input type="text" id="timeline-description" placeholder="Timeline Description" />
              <button type="submit" className="btn login-button" onClick={this.saveTimeline}>Update Timeline</button>
            </div>
            <div>
              <h2 className="center title-banner timeline-title-description">{this.state.titleHeader}</h2>
              <h4 className="center description-banner timeline-title-description">{this.state.descriptionHeader}</h4>
            </div>
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
