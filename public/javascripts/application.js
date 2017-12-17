var App = Backbone.View.extend({
  el: 'body',
  initialize: function() {
    this.collection = new Lists();
    this.board = new BoardView(this.collection);
    this.search = new SearchView(this.collection);
  }
});