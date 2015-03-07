var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('add', { title: 'ADD A PAGE '});
});

router.post('/submit', function(req, res, next) {
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

  var models = require('../models/');

  var title = req.body.page_title,
      body = req.body.page_content,
      url_name = generateUrlName(title),
      tags = req.body.page_tags.split(" ");

  var p = new models.Page({ "title": title, "body": body, "url_name": url_name, "tags": tags });
  p.save();
  res.redirect('/');
});

module.exports = router;
