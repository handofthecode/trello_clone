var Lists = Backbone.Collection.extend({
  listSerial: 1,
  cardSerial: 1,
  model: List,
  loadData: function() {
    $.get('board', this.success.bind(this));
  },
  saveData: function() {
    console.log('post Request!')
    $.post('board', this.JSONify(), null, 'json');
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