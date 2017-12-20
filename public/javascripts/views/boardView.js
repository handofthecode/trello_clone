var BoardView = Backbone.View.extend({
  template: JST.board,
	el: '#board',
  events: {
    'click #list_form_toggle': 'newListFormToggle',
    'blur #listName': 'newListFormToggle',
    'submit #new_list_form form': 'addList'
  },
  // isOverflow: function() {
  //   if (e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth) {
  //     return true;
  //   }
  //   return false;
  // },
  // checkOverflow: function() {
  //   console.log(this.isOverflow(this.$el));
  // },
  showModal: function(listCard) {
    this.modal.show(listCard);
  },
  hideModal: function() {
    this.modal.$el.hide();
  },
  newListFormToggle: function(e) {
    this.listName.val('');
    this.listFormToggle.slideToggle(40);
    this.newListForm.slideToggle(40);
    if ($(e.target).is('#list_form_toggle')) this.listName.focus();
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
    this.collection.saveData();
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