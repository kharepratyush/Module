var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('collab',{ gid: '{gid}' });
  //send data of questions to forum page and make a link of all questions
});

//Left setting up. Socket.io

module.exports = router;
