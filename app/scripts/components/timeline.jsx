var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Popover = require('react-bootstrap').Popover;
var Tooltip = require('react-bootstrap').Tooltip;
var React = require('react');

//local imports
var ArkiverCollections = require('../models/collection').ArkiverCollections;

//components

var ThumbnailComponent = React.createClass({
  render: function(){
    return(
      <div className="thumbnail">
        <img src={this.props.image} />
        <p>{this.props.title}</p>
      </div>
    )
  }
});

var ModalContainer = React.createClass({
  getInitialState: function() {
      return { showModal: false };
    },
    close: function() {
      this.setState({ showModal: false });
    },

    open: function() {
      this.setState({ showModal: true });
    },

    render: function() {
      console.log("collection passed as ", this.props.collection);
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

      // var collectionThumbnails = this.props.collection.models.map(function(collection){
      //   return (
      //     <ThumbnailComponent image={collection.cover} title={collection.title}/>
      //   )
      // });
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
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Text in a modal</h4>
              <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

              <h4>Popover in a modal</h4>

              <hr />

              <h4>Overflowing text to show scroll behavior</h4>
              <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
  }
});

var TimelineContainer = React.createClass({
  componentDidMount: function(){
    var collection = new ArkiverCollections();

    collection.fetch({
      beforeSend: function(xhr){
        xhr.setRequestHeader("Accept", "*/*,version=2");
        xhr.setRequestHeader('Authorization', 'Token token=a9e757198b0339c5441cea4cbe8cd51a');
      },
      success: function(resp){
        console.log('collection fetched, resp is ', resp);
        collection.url = collection.models[0].get("links").next;
        collection.models = collection.models[0].get("collections");

        // collection.url = resp.links.next;
        // collection.models = resp.collections;
        this.setState({collection: collection});
      }
    });
  },
  render: function(){
    return(
      <ModalContainer collection={this.state.collection}  />
    )
  }
});


module.exports = {
  TimelineContainer: TimelineContainer
}
