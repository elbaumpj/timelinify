var Backbone = require('backbone');


var Timeline = Backbone.Model.extend({
  urlRoot: 'https://arkiver-beta.herokuapp.com/api/timelines'
});

var TimelineCollection = Backbone.Collection.extend({
  model: Timeline,
  url: 'https://arkiver-beta.herokuapp.com/api/timelines'
});

var Event = Backbone.Model.extend({

});

var EventCollection = Backbone.Collection.extend({
  model: Event,
  url: 'https://arkiver-beta.herokuapp.com/api/timelines/:timeline_id/events'
});


module.exports = {
  Timeline: Timeline,
  TimelineCollection: TimelineCollection,
  Event: Event,
  EventCollection: EventCollection
}
