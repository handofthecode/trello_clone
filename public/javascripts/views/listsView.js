var ListsView = Backbone.View.extend({
  listsTemplate: JST.list,
  cardsTemplate: JST.card,
  el: '#lists',
  events: {
    'click .card_form_toggle': 'newCardFormToggle',
    'click .cancel': 'newCardFormToggle',
    'keypress textarea': 'handleTextArea',
    'submit .new_card_form form': 'addCard',
    'submit .renameList': 'renameList',
    'submit .renameCard': 'renameCard',
    'click .card': 'modal',
    'click .icon_pencil': 'editCardTitle'
  },
  editCardTitle: function() {
    // TODO //
  },
  modal: function(e) {
    this.trigger('modal', this.getListCard(e));
  },
  renameCard: function(e) {
    e.preventDefault();
    $form = $(e.target);
    var listID = this.getListID(e);
    var cardID = this.getCardID(e);
    var title = $form.find('input[type="text"]').val();
    if ($form.siblings('h2').html() === title) this.toggleCardNameForm(e);
    else {
      this.collection.get(listID).cards.get(cardID).set({title: title});
    }
  },
  renameList: function(e) {
    e.stopPropagation();
    e.preventDefault();
    $form = $(e.target);
    var id = this.getListID(e);
    var title = $form.find('input[type="text"]').val();
    if ($form.siblings('h1').html() === title) this.toggleListNameForm(e);
    else this.collection.get(id).set({title: title});

  },
  parentList: function(e) {
    if (e.target) return $(e.target).closest('.list');
    return $(e).closest('.list');
  },
  getListID: function(e) {
    return this.parentList(e).attr('data-id');
  },
  parentCard: function(e) {
    if (e.target) return $(e.target).closest('.card');
    return $(e).closest('.card');
  },
  getCardID: function(e) {
    return this.parentCard(e).attr('data-id');
  },
  handleTextArea: function(e) {
    if (e.key === 'Enter') this.addCard(e);
  },
  addCard: function(e) {
    e.preventDefault();
    var title = $(e.target).closest('.list').find('textarea').val();
    var list = this.collection.get(this.getListID(e));
    list.cards.add({title: title, id: this.collection.cardSerial++}, {silent: true});
    list.setCards();
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
    this.setCardDrags();
  }, // DRAGULA //
  setCardDrags: function() {
    this.cardDrags = dragula($('.cards').toArray(), {direction: 'vertical'});
    this.cardDrags.on('drop', function(el, target, src, sib) {
      var index = -1;
      var destList = this.collection.get(this.getListID(target));
      var list, card, sibList, sibCard;
      [list, card] = this.getListCard(src, el);
      list.cards.remove(card, {silent: true});
      list.set('cards', list.cards);
      if (sib !== null) {
        [sibList, sibCard] = this.getListCard(sib);
        index = +sibList.cards.indexOf(sibCard);
      }
      destList.cards.add(card, {at: index});
      destList.setCards();
    }.bind(this));
  },
  setListDrags: function() {
    var isList = {
      moves: function (el, src, handle, sib) {
        return !$(handle).closest('.card').length;
      },
      direction: 'horizontal'
    }
    dragula([this.el], isList).on('drop', function(el, _, _, sib) {
      var index = -1;
      var model = this.collection.get(this.getListID(el));
      this.collection.remove(model, {silent: true});
      if (sib !== null) {
        var sibling = this.collection.get(this.getListID(sib))
        index = +this.collection.indexOf(sibling);
      }
      this.collection.add(model, {at: index, silent: true});
      this.collection.trigger('update');
    }.bind(this));
  },
  getListCard: function(e, el) {
    var cardID = this.getCardID(el || e);
    var listID = this.getListID(e);
    var list = this.collection.get(listID);
    var card = list.cards.get(cardID);
    return [list, card];
  },
  renderCards: function(list) {
    var id = list.get('id');
    var $el = $('.list[data-id="' + id + '"]').find('.cards')
    $el.html(this.cardsTemplate({ cards: list.cards.toJSON() }));
  },
  initialize: function(lists) {
    this.collection = lists;
    this.setListDrags();
  }
});