var Backbone = require('backbone');


var ArkiverCollectionModel = Backbone.Model.extend({

});


var ArkiverCollections = Backbone.Collection.extend({
  model: ArkiverCollectionModel,
  url: 'https://arkiver-beta.herokuapp.com/api/collections?paginate=true&count=20&page=1',
  getNextSet: function() {
    $.ajax({
      url: this.url,
      beforeSend: function(xhr){
        xhr.setRequestHeader("Accept", "*/*,version=2");
        xhr.setRequestHeader('Authorization', 'Token token=a9e757198b0339c5441cea4cbe8cd51a');
      },
      success: function(resp){
        this.add(resp.collections);
        this.url = resp.links.next;
      }
    });
  }
});

module.exports = {
  ArkiverCollectionModel: ArkiverCollectionModel,
  ArkiverCollections: ArkiverCollections
}
