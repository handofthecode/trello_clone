var List = Backbone.Model.extend({
  serialID: 1,
  initialize: function() {
    this.cards = new Cards();
  }
});

var Cards = Backbone.Collection.extend({
  model: Card
})