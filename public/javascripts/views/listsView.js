var ListsView = Backbone.View.extend({
  listsTemplate: JST.list,
  listTemplate: JST.one_list,
  cardsTemplate: JST.card,
  cardTemplate: JST.one_card,
  el: '#lists',
  events: {
    'click .card_form_toggle': 'newCardFormToggle',
    'blur .new_card_form textarea': 'hideCardForm',
    'mousepress': 'closeForms',
    'click .cancel': 'hideCardForm',
    'keydown .new_card_form textarea': 'handleNewCardKeyPress',
    'submit .new_card_form form': 'addCard',
    'submit .renameList': 'renameList',
    'submit .renameCard': 'renameCard',
    'click .icon_pencil': 'openQuickEdit',
    'click .tint': 'closeQuickEdit',
    'click form.renameCard': 'closeQuickEdit',
    'click .card': 'modal',
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
  renameCard: function(e) {
    e.preventDefault();
    $form = $(e.target);
    var listCard = this.getListCard(e);
    var title = $form.find('textarea').val();
    if ($form.siblings('h2').html() === title) this.closeQuickEdit(e);
    else {
      listCard[1].set({title: title});
      Backbone.sync('update', listCard[1]);
      this.renderCards(listCard[0]);
    }
  },
  renameList: function(e) {
    e.stopPropagation();
    e.preventDefault();
    var $form = $(e.target);
    var id = this.getListID(e);
    var list = this.collection.get(id);
    var title = $form.find('input[type="text"]').val();
    if ($form.siblings('h1').html() === title) {
      this.toggleListNameForm(e);
    } else {
      list.set({title: title});
      Backbone.sync('update', list);
    }
    $form.find('input[type="text"]').blur();
  },
  addCard: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.submitTimer.call(this);
    var listID = this.getListID(e);
    var title = this.parentList(e).find('.new_card_form textarea').val();
    if (title) {
      var list = this.collection.get(listID);
      list.cards.add({title: title, id: this.collection.cardSerial++});
      Backbone.sync('create', list.cards.at(-1));
      this.appendCard(list);
      this.newCardFormToggle(this.getListByID(listID));
    }
  },
  submitTimer: function() {
    this.submitted = true;
    setTimeout(function() {
      this.submitted = false;
    }.bind(this), 1000)
  },
  newCardFormToggle: function(e) {
    this.$('.card_form_toggle').show();
    this.$('.new_card_form').hide();
    this.showCardForm(e).find('textarea').focus().val('');
  },
  handleNewCardKeyPress: function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value !== '') this.addCard(e);
    } else if (e.key === 'Escape') {
      this.hideCardForm(e);
    }
  },
  showCardForm: function(e) {
    var $list = this.parentList(e);
    var cards = $list.find('.cards').addClass('long')[0];
    cards.scrollBy(cards.innerHeight);
    $list.find('.card_form_toggle').hide();
    return $list.find('.new_card_form').show();
  },
  hideCardForm: function(e) {
    setTimeout(function() {
      if (!this.submitted) {
        var $list = this.parentList(e);
        $list.find('.cards').removeClass('long');
        $list.find('.card_form_toggle').show();
        $list.find('.new_card_form').hide();
      }
    }.bind(this), 80);
  },
  closeForms: function(e) {
    if (e.target.classList.contains('save') ||
        e.target.classList.contains('card_form_toggle') ||
        e.target.classList.contains('nameInput')) {
    } else {
      $('.cards').removeClass('long');
      $('.card_form_toggle').show();
      $('.new_card_form').hide();
    }
  },
  closeQuickEdit: function(e) {
    e.stopPropagation();
    if (e.target.nodeName === 'FORM' || e.target.className === 'tint') {
      this.parentCard(e).removeClass('editing');
    }
  },
  modal: function(e) {
    if (!this.parentCard(e).hasClass('editing')) {
      this.collection.trigger('modal', this.getListCard(e));
    }
  }, // DRAGULA //
  setCardDrags: function() {
    this.cardDrags = dragula($('.draggable').toArray(), {direction: 'vertical'});
    this.cardDrags.on('drop', function(el, target, src, sib) {
      var idx2 = -1;
      var list2 = this.collection.get(this.getListID(target));
      var list1, card, sibList, sibCard, idx1;
      [list1, card] = this.getListCard(src, el);
        idx1 = +list1.cards.indexOf(card);
      list1.cards.remove(card, {silent: true});
      if (sib !== null) {
        [sibList, sibCard] = this.getListCard(sib);
        idx2 = +sibList.cards.indexOf(sibCard);
      }
      list2.cards.add(card, {at: idx2});
      this.collection.saveCardMove(list1.get('id'), idx1, list2.get('id'), idx2);
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
      this.collection.saveListMove();
    }.bind(this));
  }, // HELPERS //
  getListCard: function(e, el) {
    var cardID = this.getCardID(el || e);
    var listID = this.getListID(e);
    var list = this.collection.get(listID);
    var card = list.cards.get(cardID);
    return [list, card];
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
  }, // RENDER //
  renderCards: function(list) {
    var $cards = this.getListByID(list.get('id')).find('.draggable');
    $cards.html(this.cardsTemplate({ cards: list.cards.toJSON() }));
  },
  appendCard: function(list) {
    var card = list.cards.toJSON().slice(-1)[0];
    var $cards = this.getListByID(list.get('id')).find('.draggable');
    $cards.append(this.cardTemplate(card));
  },
  appendList: function(list) {
    this.$el.append(this.listTemplate(list.toJSON()));
    this.renderCards(list);
    this.cardDrags.containers = [$('.draggable')];
  },
  render: function() {
    this.$el.html(this.listsTemplate({ lists: this.collection.toJSON() }));
    this.collection.forEach(list => this.renderCards(list));
    this.setListDrags();
    this.setCardDrags();
  },
  initialize: function(lists) {
    this.collection = lists;
    this.listenTo(this.collection, 'renderCards', this.renderCards.bind(this));
  }
});