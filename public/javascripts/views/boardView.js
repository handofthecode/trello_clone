var BoardView = Backbone.View.extend({
  template: JST.board,
	el: '#board',
  events: {
    'click #list_form_toggle': 'newListFormToggle',
    'mousedown': 'handleNewListClicks',
    'keydown #listName': 'handleNewListKeyDown',
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
  handleNewListKeyDown: function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value !== '') this.addList(e);
    } else if (e.key === 'Escape') {
      this.newListFormClose();
    }
  },
  handleNewListClicks: function(e) {
    if (e.target.id !== 'listName' && !e.target.classList.contains('save')) {
      this.newListFormClose();
    }
  },
  newListFormClose: function() {
    this.listFormToggle.slideDown(40);
    this.newListForm.slideUp(40);
  },
  addList: function(e) {
    e.preventDefault();
    if (this.listName.val()) {
      this.collection.add({
        title: this.listName.val(),
        id: this.collection.listSerial++
      });
      var list = this.collection.at(-1);
      Backbone.sync('create', list);
      this.listsView.appendList(list);
    }
    this.listName.val('');
    this.listName.focus();
    this.listsView.setCardDrags();
  },
  renderLists: function(e) {
    this.listsView.render();
  },
  registerListeners: function() {
    this.listenTo(this.collection, 'reset', this.renderLists.bind(this));
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