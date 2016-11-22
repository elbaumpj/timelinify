var Backbone = require('backbone');
var _ = require('underscore');

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
    console.log("timeline id is ", this);
    return 'https://arkiver-beta.herokuapp.com/api/timelines/' + this.timelineId + '/events';
  }
});

var EventCollection = Backbone.Collection.extend({
  model: Event,
  url: function(){
    return 'https://arkiver-beta.herokuapp.com/api/timelines/' + this.timelineId + '/events';
  },
  _prepareModel: function(attrs, options) {
    var model = Backbone.Collection.prototype._prepareModel.call(this, attrs, options);
    model.set('timelineId', this.timelineId);
    return model;
  }
});

var HistoricalData = Backbone.Model.extend({
  // urlRoot: 'http://history.muffinlabs.com/date'
  url: function(){
    return 'http://peters-proxy.herokuapp.com/history?month=' + this.get('month') + '&day=' + this.get('day');
  },
  parse: function(data){
    return _.sample(data.data.Events);
  }
});

module.exports = {
  Timeline: Timeline,
  TimelineCollection: TimelineCollection,
  Event: Event,
  EventCollection: EventCollection,
  HistoricalData: HistoricalData
}
