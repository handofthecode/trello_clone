var modalView = Backbone.View.extend({
	template: JST.modal,
  el: '#modal_wrap',
  events: {
    'submit .rename': 'renameCard',
    'submit .description': 'setDescription',
    'click .no_description': 'showForm',
    'click .cancel': 'close',
    'click .edit': 'showForm',
    'blur .rename input[type="text"]': 'renameCard',
    'blur textarea': 'cancel'  
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
    if (e.target.nodeName === 'FORM') {
      e.preventDefault();
      this.$title.blur();
    }
    var title = this.$title.val();
    if (title) {
      this.listCard[1].set('title', title);
      Backbone.sync('update', this.listCard[1]);
      this.collection.trigger('renderCards', this.listCard[0]);
    }
  },
  showForm: function(e) {
    this.$description.removeClass('hidden');
    this.$editToggles.hide();
    this.$descriptionText.val($('p.edit').text()).focus();
  },
  setDescription: function(e) {
    e.preventDefault();
    this.listCard[1].set('description', this.$descriptionText.val());
    Backbone.sync('update', this.listCard[1]);
    this.collection.trigger('renderCards', this.listCard[0]);
    this.render(this.listCard);
    this.$description.addClass('hidden');

  },
  cancel: function(e) {
    if (!$(e.relatedTarget).is('.save')) {
      this.$description.addClass('hidden');
      this.$editToggles.show();
    }
  },
  render: function(listCard) {
    this.listID = listCard[0].get('id');
    this.cardID = listCard[1].get('id');
    this.listCard = listCard;
    var modalData = listCard[1].toJSON();
    modalData.listTitle = listCard[0].get('title');
    this.$modal.html(this.template(modalData));
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