var Lists = Backbone.Collection.extend({
  listSerial: 1,
  cardSerial: 1,
  model: List,
  url: '/board',
  saveCardMove(origList, destList, card, idx) {
    $.ajax({
      url: '/lists',
      method: 'PUT',
      data: JSON.stringify([origList, destList, card, idx]),
      dataType: 'json'
    });
  },
  saveListMove() {
    $.ajax({
      url: this.url,
      method: 'PUT',
      data: JSON.stringify(this.map(list => list.id)),
      dataType: 'json'
    });
  },
  loadData: function() {
    $.get('board', this.success.bind(this));
  },
  saveData: function() {
    $.post('board', this.JSONify(), null, 'text');
  },
  JSONify: function() {
    data = {lists: this.toJSON()};
    data.listSerial = this.listSerial;
    data.cardSerial = this.cardSerial;
    return JSON.stringify(data);
  },
  success: function(data) {
    this.listSerial = data.listSerial;
    this.cardSerial = data.cardSerial;
    this.reset(data.lists);
  }
});