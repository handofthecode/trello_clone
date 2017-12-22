var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var filePath = path.resolve(path.dirname(__dirname), 'data/board.json');
var _ = require('underscore');
var getData = function() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getList(req, data) {
  var lists = data.lists;
  return _.where(lists, {id: +req.params.listID})[0];
}

function getCard(req, data) {
  var list = getList(req, data);
  return _.where(list.cards, {id: +req.params.cardID})[0];
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout');
});

router.route('/board').get(function(req, res) {
  res.json(getData());
}).post(function(req, res) {
  var allData = Object.keys(req.body)[0];
  fs.writeFileSync(filePath, allData, 'utf8');
  res.send('200');
}).put(function(req, res) {
  var data = getData();
  var lists = data.lists;
  var order = JSON.parse(Object.keys(req.body)[0]);
  var result = order.map(el => _.where(lists, {id: el})[0]);
  data.lists = result;
  saveData(data);
  res.end();
});

router.route('/lists').put(function(req, res) {
  var data = getData();
  var lists = data.lists;
  var origList, destList, card, idx, i;
  [origList, destList, card, idx] = JSON.parse(Object.keys(req.body)[0]);
  origList = _.findWhere(lists, {id: origList});
  destList = _.findWhere(lists, {id: destList});
  i = origList.cards.findIndex(el => card === el.id)
  card = origList.cards.splice(i, 1)[0];
  destList.cards.splice(idx, 0, card);
  saveData(data);
  res.end();
});

router.route('/lists/:listID').get(function(req, res) {
  res.json(getList(req, getData()));
}).post(function(req, res) {
  var data = getData();
  data.lists.push(req.body);
  data.listSerial++;
  saveData(data);
  res.end();
}).put(function(req, res) {
  var data = getData();
  var list = getList(req, data);
  list.title = req.body.title;
  list.cards = req.body.cards;
  saveData(data);
  res.end();
});

router.route('/lists/:listID/cards/:cardID').get(function(req, res) {
  res.json(getCard(req, getData()));
}).post(function(req, res) {
  var data = getData();
  var list = getList(req, data);
  list.cards.push(req.body);
  data.cardSerial++;
  saveData(data);
  res.end();
}).put(function(req, res) {
  var data = getData();
  var card = getCard(req, data);
  card.title = req.body.title;
  card.description = req.body.description;
  saveData(data);
  res.end();
})

module.exports = router;
