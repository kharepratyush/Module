var express = require('express');
var router = express.Router();

var gid='gid';
var date='date';
var link = "http://localhost:9001/p/gid+date";
router.get('/', function(req, res, next) {
  res.redirect(link);
  //send data of questions to forum page and make a link of all questions
});


//Left setting up. Socket.io

module.exports = router;
