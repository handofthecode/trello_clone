var Lists = Backbone.Collection.extend({
  listSerial: 1,
  cardSerial: 1,
  model: List,
  url: '/board',
  saveCardMove(list1, idx1, list2, idx2) {
    $.ajax({
      url: '/lists',
      method: 'PUT',
      data: JSON.stringify([list1, idx1, list2, idx2]),
      contentType: "application/json; charset=utf-8"
    });
  },
  saveListMove() {
    $.ajax({
      url: this.url,
      method: 'PUT',
      data: JSON.stringify(this.map(list => list.id)),
      contentType: "application/json; charset=utf-8"
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