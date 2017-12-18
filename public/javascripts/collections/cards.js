var List = Backbone.Model.extend({
  setCards: function() {
    this.set('cards', this.cards.toJSON());
    this.collection.trigger('update');
  },
  initialize: function(list) {
    this.cards = new Cards(list.cards);
    // this.listenTo(this.cards, 'update change reset add', this.updateLists.bind(this))
  }
});

var Cards = Backbone.Collection.extend({
  model: Card
})