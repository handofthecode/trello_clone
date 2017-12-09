var App = Backbone.View.extend({
  el: 'body',
  initialize: function() {
    this.board = new BoardView();
  }
});