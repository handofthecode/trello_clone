var modalView = Backbone.View.extend({
	template: JST.modal,
  el: '#modal_wrap',
  events: {
    'submit .rename': 'renameCard',
    'submit .description': 'setDescription',
    'click .no_description': 'showForm',
    'click .cancel': 'close',
    'click .edit': 'showForm',
    'click .cancelEdit': 'cancel'  
  },
  close: function() {
    this.$modal.hide();
    this.$tint.hide();
  },
  show: function(e) {
    this.render(e);
    this.$modal.show();
    this.$tint.show();
  },
  renameCard: function(e) {
    e.preventDefault();
    this.listCard[1].set('title', this.$title.val());
    this.collection.trigger('update');
    this.$title.blur();
  },
  showForm: function(e) {
    this.$description.removeClass('hidden');
    this.$editToggles.hide();
    this.$descriptionText.focus();
  },
  setDescription: function(e) {
    e.preventDefault();
    this.listCard[1].set('description', this.$descriptionText.val());
    this.render(this.listCard);
    this.$description.addClass('hidden');
  },
  cancel: function() {
    this.$description.addClass('hidden');
    this.$editToggles.show();
  },
  render: function(listCard) {
    this.listID = listCard[0].get('id');
    this.cardID = listCard[1].get('id');
    this.listCard = listCard;
    var modalData = listCard[1].toJSON();
    modalData.listTitle = listCard[0].get('title');
    this.$modal.html(this.template( modalData ));
    this.cacheDOM();
  },
  cacheDOM: function() {
    this.$description = this.$('.description');
    this.$descriptionText = this.$description.find('textarea');
    this.$title = this.$('input[type="text"]');
    this.$editToggles = this.$('.edit');
  },
  initialize: function(collection) {
    this.collection = collection;
    this.$tint = this.$('#tint');
    this.$modal = this.$('#modal');
  }
});