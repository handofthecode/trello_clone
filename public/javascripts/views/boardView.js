var BoardView = Backbone.View.extend({
  template: JST.board,
	el: '#board',
  events: {
    'click #list_form_toggle': 'newListFormToggle',
    'click #cancel': 'newListFormToggle',
    'submit #new_list_form form': 'addList'
  },
  showModal: function(listCard) {
    this.modal.show(listCard);
  },
  hideModal: function() {
    this.modal.$el.hide();
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
      id: this.collection.listSerial++
    });
    this.listName.val('');
    this.listName.focus();
  },
  update: function(e) {
    this.listsView.render();
    this.setWidth();
    this.collection.saveData();
  },
  setWidth: function() {
    if (this.collection.length < 3) return;
      var width = (this.collection.length + 1) * 280;
      this.$el.css({width: width + 'px'});
  },
  registerListeners: function() {
    this.listenTo(this.collection, 'update reset change:title', this.update.bind(this));
    this.listenTo(this.listsView, 'modal', this.showModal.bind(this));
  },
  render: function() {
    this.$el.html(this.template());
  },
  cacheDOM: function() {
    this.newListForm = this.$('#new_list_form');
    this.listName = this.$('#listName');
    this.listFormToggle = this.$('#list_form_toggle');
  },
  initialize: function(collection) {
    this.render();
    this.cacheDOM();
    this.collection = collection;
    this.listsView = new ListsView(this.collection);
    this.modal = new modalView(this.collection);
    this.registerListeners();
    this.collection.loadData();
  }
});