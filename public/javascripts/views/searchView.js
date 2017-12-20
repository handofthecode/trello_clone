var SearchView = Backbone.View.extend({
  template: JST.search,
  el: '#search',
  events: {
    'keyup input': 'renderResults',
    'click .card': 'showModal',
    'blur input': 'hideResults'
  },
  showModal: function(e) {
    this.collection.trigger('modal', this.getListCard(e));
  },
  getListCard: function(e) {
    var $card = $(e.target).closest('.card');
    var cardID = $card.attr('data-card-id');
    var listID = $card.attr('data-list-id');
    var list = this.collection.get(listID);
    var card = list.cards.get(cardID);
    return [list, card];
  },
  hideResults: function() {
    this.$results.slideUp(40);
    this.$input.val('');
  },
  renderResults: function() {
    var query = this.$input.val().toLowerCase();
    if (query) {
      var matches = this.findCards(query);
      this.render(matches);
      this.$results.show();
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
            card.listID = list.id;
            card.listTitle = list.title
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