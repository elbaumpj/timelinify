var Backbone = require('backbone');
var $ = require('jquery');

var ScrapbookModel = Backbone.Model.extend({

});


var ScrapbookCollection = Backbone.Collection.extend({
  model: ScrapbookModel,
  url: function(){
    return 'https://arkiver-beta.herokuapp.com/api/collections?' + this.nextQuery;
  },
  nextQuery: 'paginate=true&count=20&page=1',
  initialize: function(){
    $.ajaxSetup({
      beforeSend: function(xhr){
        xhr.setRequestHeader("Accept", "*/*,version=2");
        xhr.setRequestHeader('Authorization', 'Token token=a9e757198b0339c5441cea4cbe8cd51a');
      }
    });
  },

  parse: function(data){
    return data.collections;
  },

  getNextSet: function() {
    console.log("this is ", this);
    var self = this;

    this.fetch().then(function(response){
      self.nextQuery = response.links.next ? response.links.next.split('?')[1] : '';
    });

  }
});

var Moment = Backbone.Model.extend({

});

var MomentCollection = Backbone.Collection.extend({
  model: Moment,
  url: function(){
    return 'https://arkiver-beta.herokuapp.com/api/collections/' + this.scrapbookId + this.nextQuery;
  },
  nextQuery: 'paginate=true&count=20&page=1',
  initialize: function(){
    $.ajaxSetup({
      beforeSend: function(xhr){
        xhr.setRequestHeader("Accept", "*/*,version=2");
        xhr.setRequestHeader('Authorization', 'Token token=a9e757198b0339c5441cea4cbe8cd51a');
      }
    });
  },
  parse: function(data){
    return data.moments;

  },
  getNextSet: function() {
    console.log("this is ", this);
    var self = this;

    this.fetch().then(function(response){
      console.log(response);
      self.nextQuery = response.links.next ? response.links.next.split('?')[1] : '';
    });

  }
});



module.exports = {
  ScrapbookModel: ScrapbookModel,
  ScrapbookCollection: ScrapbookCollection,
  Moment: Moment,
  MomentCollection: MomentCollection
};
