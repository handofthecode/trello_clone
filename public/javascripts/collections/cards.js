var List = Backbone.Model.extend({
  initialize: function() {
    this.cards = new Cards();
  }
});

var Cards = Backbone.Collection.extend({
  model: Card
})