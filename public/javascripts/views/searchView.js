var SearchView = Backbone.View.extend({
  template: JST.search,
  el: '#search',
  events: {
    'keyup input': 'renderResults',
    'blur input': 'hideResults'
  },
  hideResults: function() {
    this.$results.slideUp();
  },
  renderResults: function() {
    console.log('test');
    var query = this.$input.val();
    var matches = this.findCards(query);
    this.render(matches);
    this.$results.slideDown();
  },
  findCards: function(query) {
    var matches = [];
    this.collection.toJSON().forEach(list => {
      if (list.cards) {
        list.cards.forEach(card => {
          if (card.description && card.description.includes(query) || card.title.includes(query)) {
            matches.push(card);
          }
        });
      }
    });

    return matches;
  },
  render: function(cards) {
    this.$results.html(this.template({cards: cards}));
  },
  initialize: function(collection) {
    this.collection = collection;
    this.$results = this.$('#results');
    this.$input = this.$('input');
  }
});