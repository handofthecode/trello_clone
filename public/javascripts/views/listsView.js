var ListsView = Backbone.View.extend({
  listsTemplate: JST.list,
  cardsTemplate: JST.card,
  el: '#lists',
  events: {
    'click .card_form_toggle': 'newCardFormToggle',
    'click .cancel': 'newCardFormToggle',
    'submit .new_card_form form': 'addCard',
    'click .list h1': 'showListNameForm',
    'submit .renameList': 'renameList'
  },
  renameList: function(e) {
    e.preventDefault();
    $form = $(e.target);
    var id = this.getID(e);
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
    return $(e.target).closest('.list')
  },
  getID: function(e) {
    return this.parentList(e).attr('data-id');
  },
  addCard: function(e) {
    e.preventDefault();
    var title = $(e.target).find('textarea').val();
    var list = this.collection.get(this.getID(e));
    list.cards.add({title: title, id: list.serialID++})
    this.collection.trigger('change');
  },
  newCardFormToggle: function(e) {
    var $formToggle = this.parentList(e).find('.card_form_toggle');
    var $cardForm = $formToggle.siblings('.new_card_form');
    $cardForm.slideToggle();
    $formToggle.slideToggle();
  },
  render: function() {
    this.$el.html(this.listsTemplate({ lists: this.collection.toJSON() }));
    this.collection.forEach(list => this.renderCards(list));
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