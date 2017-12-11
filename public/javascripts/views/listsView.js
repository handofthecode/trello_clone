var ListsView = Backbone.View.extend({
  listsTemplate: JST.list,
  cardsTemplate: JST.card,
  el: '#lists',
  events: {
    'click .card_form_toggle': 'newCardFormToggle',
    'click .cancel': 'newCardFormToggle',
    'keypress textarea': 'handleTextArea',
    'submit .new_card_form form': 'addCard',
    'click .list h1': 'showListNameForm',
    'submit .renameList': 'renameList',
  },
  renameList: function(e) {
    e.preventDefault();
    $form = $(e.target);
    var id = this.getListID(e);
    var title = $form.find('input[type="text"]').val();
    if ($form.siblings('h1').html() === title) this.toggleListNameForm(e);
    else this.collection.get(id).set({title: title});
  },
  toggleListNameForm: function(e) {
    var $list = $(e.target).closest('.list');
    var $title = $list.find('h1');
    var $form = $list.find('.renameList');
    var $input = $form.find('input[type="text"]');
    $title.toggle();
    $form.toggle();

    return [$title, $input];
  },
  showListNameForm: function(e) {
    var $title, $input;
    [$title, $input] = this.toggleListNameForm(e);
    $input.val($title.html());
    $input.select();
  },
  parentList: function(e) {
    if (e.target) return $(e.target).closest('.list');
    return $(e).closest('.list');
  },
  getListID: function(e) {
    return this.parentList(e).attr('data-id');
  },
  handleTextArea: function(e) {
    if (e.key === 'Enter') this.addCard(e);
  },
  addCard: function(e) {
    e.preventDefault();
    var title = $(e.target).closest('.list').find('textarea').val();
    var list = this.collection.get(this.getListID(e));
    list.cards.add({title: title, id: list.serialID++})
    this.collection.trigger('change');
  },
  newCardFormToggle: function(e) {
    var $formToggle = this.parentList(e).find('.card_form_toggle');
    var $cardForm = $formToggle.siblings('.new_card_form');
    var $input = $cardForm.find('textarea');
    $cardForm.slideToggle();
    $formToggle.slideToggle();
    $input.focus();
  },
  render: function() {
    this.$el.html(this.listsTemplate({ lists: this.collection.toJSON() }));
    this.collection.forEach(list => this.renderCards(list));
    this.setDrags();
  },
  setDrags: function() {
    var isCard = {
      invalid: function (target) {
        return !!$(target).closest('.card').length;
      }
    }
    this.listDrags = dragula([this.el, this.el], isCard);
    this.cardDrags = dragula($('.cards').toArray());
    this.setDragListeners();
  },
  setDragListeners: function() {
    this.listDrags.on('drop', function(el, _, _, sibling) {
      var index = -1;
      var model = this.collection.get(this.getListID(el));
      this.collection.remove(model, {silent: true});
      if (sibling !== null) {
        var siblingID = this.getListID(sibling);
        var sibling = this.collection.get(siblingID)
        index = +this.collection.indexOf(sibling);
      }

      this.collection.add(model, {at: index, silent: true});
    }.bind(this));
  },
  renderCards: function(list) {
    var id = list.get('id');
    var $el = $('.list[data-id="' + id + '"]').find('.cards')
    $el.html(this.cardsTemplate({ cards: list.cards.toJSON() }));
  },
  initialize: function(lists) {
    this.collection = lists;
  }
});