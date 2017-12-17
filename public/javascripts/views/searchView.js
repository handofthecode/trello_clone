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
    var query = this.$input.val().toLowerCase();
    if (query) {
      var matches = this.findCards(query);
      this.render(matches);
      this.$results.slideDown();
    } else {
      this.hideResults();
    }
  },
  findCards: function(query) {
    var matches = [];
    this.collection.toJSON().forEach(list => {
      if (list.cards) {
        list.cards.forEach(card => {
          if (card.description && card.description.toLowerCase().includes(query) || 
              card.title.toLowerCase().includes(query)) {
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