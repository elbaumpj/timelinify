var Backbone = require('backbone');


var Timeline = Backbone.Model.extend({
  urlRoot: 'https://arkiver-beta.herokuapp.com/api/timelines'
});

var TimelineCollection = Backbone.Collection.extend({
  model: Timeline,
  url: 'https://arkiver-beta.herokuapp.com/api/timelines',
  parse: function(data){
    console.log(data);
    return data;
  }
});

var Event = Backbone.Model.extend({
  urlRoot: function(){
    return 'https://arkiver-beta.herokuapp.com/api/timelines/' + this.timelineId + '/events';
  }
});

var EventCollection = Backbone.Collection.extend({
  model: Event,
  url: function(){
    return 'https://arkiver-beta.herokuapp.com/api/timelines/' + this.timelineId + '/events';
  }
});


module.exports = {
  Timeline: Timeline,
  TimelineCollection: TimelineCollection,
  Event: Event,
  EventCollection: EventCollection
}
