var List = Backbone.Model.extend({
  updateLists: function() {
    this.collection.trigger('update');
  },
  setCards: function() {
    this.set('cards', this.cards.toJSON());
    this.updateLists();
  },
  initialize: function(list) {
    this.cards = new Cards(list.cards);
    // this.listenTo(this.cards, 'update change reset add', this.updateLists.bind(this))
  }
});

var Cards = Backbone.Collection.extend({
  model: Card
})