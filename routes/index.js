var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"hello":"Welcome to Expressjs 4.15/MySQL RESTful API"}, null, 3));
});

module.exports = router;
