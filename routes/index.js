var express = require('express');
var router = express.Router();
var models = require('../models/');

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Page.find({}, function(err, data) {
  	res.render('index', { title: 'BROWSE MY WIKISTACK', docs: data });
  });
});

router.get('/wiki/:url_name', function(req, res, next) {
	models.Page.findOne({ url_name: req.params.url_name }, function(err, data) {
		if (err) { return res.status(404).json(); }
		res.render('show', { title: data.title, body: data.body });
	});
});

module.exports = router;
