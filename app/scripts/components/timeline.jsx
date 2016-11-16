var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Popover = require('react-bootstrap').Popover;
var Tooltip = require('react-bootstrap').Tooltip;
var React = require('react');

//local imports
var ScrapbookCollection = require('../models/scrapbook').ScrapbookCollection;
var MomentCollection = require('../models/scrapbook').MomentCollection;
//components

var ThumbnailComponent = React.createClass({
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
      console.log("collection passed as ", this.props.collection);
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
      var collectionThumbnails = this.props.collection.models.map(function(collection){
        return (
          <ThumbnailComponent scrapbook={collection} viewMoments={self.props.viewMoments}/>
        )
      });
      return (
        <div>
          <p>Click to get your Arkver photos!</p>

          <Button
            bsStyle="primary"
            bsSize="large"
            onClick={this.open}
          >
            Get your photos
          </Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Arkiver Collections</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              {collectionThumbnails}


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
      displayType: 'scrapbook'
    };
  },
  componentDidMount: function(){
    var collection = this.state.collection;

    collection.fetch({
      beforeSend: function(xhr){
        xhr.setRequestHeader("Accept", "*/*,version=2");
        xhr.setRequestHeader('Authorization', 'Token token=a9e757198b0339c5441cea4cbe8cd51a');
      },
      success: function(resp){
        console.log('collection fetched, resp is ', resp);
        collection.url = "https://arkiver-beta.herokuapp.com"+collection.models[0].get("links").next;
        collection.models = collection.models[0].get("collections");

      }
    });
  },
  viewMoments: function(scrapbookId){
    console.log(scrapbookId);
    var moments = new MomentCollection();
    moments.scrapbookId = scrapbookId;
    var fetchedMoments = moments.fetch();
    console.log(fetchedMoments);
    this.setState({displayType: 'moment'})
  },
  render: function(){
    return(
      <ModalComponent collection={this.state.collection} viewMoments={this.viewMoments} />
    )
  }
});


module.exports = {
  TimelineContainer: TimelineContainer
}
