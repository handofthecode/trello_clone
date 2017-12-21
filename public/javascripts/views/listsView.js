var ListsView = Backbone.View.extend({
  listsTemplate: JST.list,
  cardsTemplate: JST.card,
  el: '#lists',
  events: {
    'click .card_form_toggle': 'newCardFormToggle',
    'click .cancel': 'hideCardForm',
    'blur .new_card_form textarea': 'hideCardForm',
    'keypress .new_card_form textarea': 'handleNewCardEnter',
    'submit .new_card_form form': 'addCard',
    'submit .renameList': 'renameList',
    'submit .renameCard': 'renameCard',
    'click .icon_pencil': 'openQuickEdit',
    'click .tint': 'closeQuickEdit',
    'click form.renameCard': 'closeQuickEdit',
    'click .card': 'modal',
  },
  closeQuickEdit: function(e) {
    e.stopPropagation();
    if (e.target.nodeName === 'FORM' || e.target.className === 'tint') {
      this.parentCard(e).removeClass('editing');
    }
  },
  openQuickEdit: function(e) {
    e.stopPropagation();
    var $card = this.parentCard(e);
    this.fixQuickEditPosition($card);
    $card.addClass('editing');
    $card.find('textarea').val($card.find('h2').text()).focus().select();
  },
  fixQuickEditPosition: function($card) {
    var $cards = $card.closest('.cards');
    var distanceFromBottom = $(window).height() - $card.offset().top;
    var negMargin = -$cards.scrollTop();
    if (distanceFromBottom < 155) {
      negMargin = distanceFromBottom - 155 + negMargin;
    }
    $cards.find('.renameCard').css('margin-top', negMargin);
  },
  modal: function(e) {
    if (!this.parentCard(e).hasClass('editing')) {
      this.collection.trigger('modal', this.getListCard(e));
    }
  },
  renameCard: function(e) {
    e.preventDefault();
    $form = $(e.target);
    var listCard = this.getListCard(e);
    var title = $form.find('textarea').val();
    if ($form.siblings('h2').html() === title) this.closeQuickEdit(e);
    else {
      listCard[1].set({title: title});
      listCard[0].setCards('update');
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
  getListByID: function(id) {
    return $('.list[data-id="' + id + '"]');
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
  handleNewCardEnter: function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value !== '') this.addCard(e);
    }
  },
  addCard: function(e) {
    e.preventDefault();
    var listID = this.getListID(e);
    var title = this.parentList(e).find('.new_card_form textarea').val();
    var list = this.collection.get(listID);
    list.cards.add({title: title, id: this.collection.cardSerial++}, {silent: true});
    list.setCards('update');
    this.newCardFormToggle(this.getListByID(listID));
  },
  newCardFormToggle: function(e) {
    this.$('.card_form_toggle').show();
    this.$('.new_card_form').hide();
    this.showCardForm(e).find('textarea').focus();
  },
  showCardForm: function(e) {
    var $list = this.parentList(e);
    var cards = $list.find('.cards').addClass('long')[0];
    cards.scrollBy(cards.innerHeight);
    $list.find('.card_form_toggle').hide();
    return $list.find('.new_card_form').show();
  },
  hideCardForm: function(e) {
    var $list = this.parentList(e);
    $list.find('.cards').removeClass('long');
    $list.find('.card_form_toggle').show();
    return $list.find('.new_card_form').hide();
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
      list.setCards();
      if (sib !== null) {
        [sibList, sibCard] = this.getListCard(sib);
        index = +sibList.cards.indexOf(sibCard);
      }
      destList.cards.add(card, {at: index});
      destList.setCards('update');
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
    var $el = this.getListByID(list.get('id')).find('.cards')
    $el.html(this.cardsTemplate({ cards: list.get('cards') }));
  },
  initialize: function(lists) {
    this.collection = lists;
    this.setListDrags();
  }
});