var BoardView = Backbone.View.extend({
  template: JST.board,
	el: '#board',
  events: {
    'click #list_form_toggle': 'newListFormToggle',
    'click #cancel': 'newListFormClose',
    'submit #new_list_form form': 'addList'
  },
  showModal: function(listCard) {
    this.modal.show(listCard);
  },
  hideModal: function() {
    this.modal.$el.hide();
  },
  newListFormToggle: function(e) {
    this.listName.val('');
    this.listFormToggle.slideUp(40);
    this.newListForm.slideDown(40);
    this.listName.focus();
  },
  newListFormClose: function(e) {
    setTimeout(function(){
      this.listFormToggle.slideDown(40);
      this.newListForm.slideUp(40);
    }.bind(this), 1);
  },
  addList: function(e) {
    e.preventDefault();
    if (this.listName.val()) {
      this.collection.add({
        title: this.listName.val(),
        id: this.collection.listSerial++
      });
      Backbone.sync('create', this.collection.at(-1));
    }
    this.listName.val('');
    this.listName.focus();
  },
  update: function(e) {
    this.listsView.render();
    // this.collection.saveData();
  },
  registerListeners: function() {
    this.listenTo(this.collection, 'update reset change:title', this.update.bind(this));
    this.listenTo(this.collection, 'modal', this.showModal.bind(this));
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
    this.collection.loadData();
    this.registerListeners();
  }
});