var BoardView = Backbone.View.extend({
  template: JST.board,
	el: '#board',
  events: {
    'click #list_form_toggle': 'newListFormToggle',
    'click #cancel': 'newListFormToggle',
    'submit #new_list_form form': 'addList'
  },
  newListFormToggle: function() {
    this.listName.val('');
    this.listFormToggle.slideToggle();
    this.newListForm.slideToggle();
    this.listName.focus();
  },
  addList: function(e) {
    e.preventDefault();
    if (this.listName.val()) this.collection.add({
      title: this.listName.val(),
      id: this.collection.serialID++
    });
    this.listName.val('');
    this.listName.focus();

  },
  update: function() {
    this.listsView.render();
  },
  registerListeners: function() {
    this.events = _.extend({}, Backbone.Events);
    this.events.listenTo(this.collection, 'update change', this.update.bind(this));
  },
  render: function() {
    this.$el.html(this.template());
  },
  cacheDOM: function() {
    this.newListForm = this.$('#new_list_form');
    this.listName = this.$('#listName');
    this.listFormToggle = this.$('#list_form_toggle');
  },
  initialize: function() {
    this.render();
    this.cacheDOM();
    this.collection = new Lists();
    this.listsView = new ListsView(this.collection);
    this.registerListeners();
  }
});