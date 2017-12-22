var Card = Backbone.Model.extend({
  url: function() {
    return 'lists/' + this.collection.listID + '/cards/' + this.get('id');
  }
});