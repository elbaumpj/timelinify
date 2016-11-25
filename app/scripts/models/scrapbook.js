var Backbone = require('backbone');
var $ = require('jquery');

var ScrapbookModel = Backbone.Model.extend({

});


var ScrapbookCollection = Backbone.Collection.extend({
  model: ScrapbookModel,
  url: 'https://arkiver-beta.herokuapp.com/api/collections?paginate=true&count=20&page=1',
  getNextSet: function() {
    console.log("this is ", this);
    var self = this;
    $.ajax({
      url: this.url,
      beforeSend: function(xhr){
        xhr.setRequestHeader("Accept", "*/*,version=2");
        xhr.setRequestHeader('Authorization', 'Token token=a9e757198b0339c5441cea4cbe8cd51a');
      },
      success: function(resp){
        console.log("RESP:", resp);
        resp.collections.map(function(collection){
          self.add(collection);
        });

        //self.add(resp.collections); that's what we had before w/ Jake...i'm manipulating to see if I can fix

        // let newModels = new ScrapbookCollection(resp.collections)
        // console.log("newModels:", newModels);
        // self.add(newModels.models);
        self.url = "https://arkiver-beta.herokuapp.com"+resp.links.next;
      }
    });
  }
});

var Moment = Backbone.Model.extend({

});

var MomentCollection = Backbone.Collection.extend({
  model: Moment,
  url: function(){
    return 'https://arkiver-beta.herokuapp.com/api/collections/' + this.scrapbookId + '?paginate=true&count=20&page=1';
  },
  parse: function(data){
    return data.moments;

  },
  getNextSet: function() {
    var self = this;
    $.ajax({
      url: this.url,
      beforeSend: function(xhr){
        xhr.setRequestHeader("Accept", "*/*,version=2");
        xhr.setRequestHeader('Authorization', 'Token token=a9e757198b0339c5441cea4cbe8cd51a');
      },
      success: function(resp){
        self.add(resp.collections);
        self.url = "https://arkiver-beta.herokuapp.com"+resp.links.next;
      }
    });
  }
});



module.exports = {
  ScrapbookModel: ScrapbookModel,
  ScrapbookCollection: ScrapbookCollection,
  Moment: Moment,
  MomentCollection: MomentCollection
};
