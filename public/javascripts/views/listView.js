var ListView = Backbone.View.extend({
  template: JST.list,
  el: '#lists',
  render: function() {
    this.$el.html(this.template({ lists: this.collection.toJSON() }));
  },
  initialize: function(lists) {
    this.collection = lists;
  }
});