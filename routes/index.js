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
	models.Page.find({ url_name: req.params.url_name }, function(err, data) {
		if (err || data.length === 0) { return res.status(404).json(); }
		if (data.length > 1) {
			// disambiguation
			return res.redirect('/wiki/' + req.params.url_name + '/disambiguation');
		}
		data[0].findSimilar(function(err, similar) {
			for (var i = 0; i < similar.length; i++) {
				if (JSON.stringify(data[0]._id) === JSON.stringify(similar[i]._id)) {
					similar.splice(i, 1);
					break;
				}
			}
			var tags = data[0].tags.join(" ");
		  res.render('show', { page: data[0], similar: similar, tags: tags });
		});
	});
});

router.get('/wiki/id/:id', function(req, res, next) {
	models.Page.findById(req.params.id, function(err, data) {
		if (err || !data) { return res.status(404).json(); }
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

router.get('/wiki/:url_name/disambiguation', function(req, res, next) {
	models.Page.find({ url_name: req.params.url_name }, function(err, data) {
		if (err || data.length < 2) { return res.status(404).json(); }
		res.render('disambiguation', { title: data[0].title + ' (Disambiguation)', docs: data });
	});
});

router.get('/wiki/edit/:id', function(req, res, next) {
	models.Page.findById(req.params.id, function(err, page) {
		if (err) { return res.status(404).json(); }
		page.tags = page.tags.join(' ');
		res.render('edit', { title: 'EDIT PAGE', page: page } );
	});
});

router.post('/wiki/edit/:id', function(req, res, next) {
	models.Page.findById(req.params.id, function(err, page) {
		if (err) { return res.status(404).json(); }

		var generateUrlName = function(name) {
		  if (typeof name != "undefined" && name !== "") {
		    // Removes all non-alphanumeric characters from name
		    // And make spaces underscore
		    return name.replace(/\s/ig,"_").replace(/\W/ig,"");
		  } else {
		    // Generates random 5 letter string
		    return Math.random().toString(36).substring(2,7);
		  }
		};
	  page.title = req.body.page_title,
	  page.body = req.body.page_content,
	  page.url_name = generateUrlName(page.title),
	  page.tags = req.body.page_tags.split(" ");
		page.save(function () {
			return res.redirect('/wiki/' + page.url_name);
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
