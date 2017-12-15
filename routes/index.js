var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var filePath = path.resolve(path.dirname(__dirname), 'data/board.json');
var data = JSON.parse(fs.readFileSync(filePath, "utf8"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout');
});

router.route('/board').get(function(req, res) {
  res.json(data);
}).post(function(req, res) {
  var data = Object.keys(req.body)[0];
  fs.writeFileSync(filePath, data, 'utf8');
  res.send('200');
});

module.exports = router;
