var List = Backbone.Model.extend({
  url: function() {
    return 'lists/' + this.get('id');
  },
  initialize: function(list) {
    this.cards = new Cards(list.cards);
    this.cards.listID = this.id;
  },
  toJSON: function() {
    console.log('jsoning around...')
    var json = _.clone(this.attributes);
    json.cards = this.cards.toJSON();
    return json;
  }
});
var Cards = Backbone.Collection.extend({
  model: Card
})