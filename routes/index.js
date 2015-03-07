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
		data.findSimilar(function(err, similar) {
			for (var i = 0; i < similar.length; i++) {
				if (JSON.stringify(data._id) === JSON.stringify(similar[i]._id)) {
					similar.splice(i, 1);
					break;
				}
			}
			var tags = data.tags.join(" ");
		  res.render('show', { page: data, similar: similar, tags: tags });
		});
	});
});

router.get('/find_by_tags', function(req, res, next) {
	res.render('find_by_tags', { title: 'FIND BY TAGS', showresults: false });
});

router.get('/tags', function(req, res, next) {
	models.Page.findByTag(req.query.page_tags.split(" "), function(err, data) {
		if (err) { return res.status(500).json(); }
		res.render('find_by_tags', { title: 'FIND BY TAGS', docs: data, showresults: true });
	});
});

module.exports = router;
