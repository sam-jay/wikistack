var marked = require('marked');

// Setting custom filters on Swig

module.exports = function(swig) {
  var page_link = function (doc) {
    var link_name;
    if (typeof doc.title !== "undefined" && doc.title !== "") {
      link_name = doc.title
    } else {
      link_name = "Page "+doc.url_name;
    }
    return "<a href='"+doc.full_route+"'>"+link_name+"</a>";
  };

  var markedFilter = function(body) {
    return marked(body);
  };

  var page_tags = function(tags) {
    return tags.split(' ').map(function (tag) {
      return "<a href='/tags?page_tags="+tag+"'>"+tag+"</a>";
    }).join(' ');
  };

  page_tags.safe = true;
  swig.setFilter('page_tags', page_tags);

  markedFilter.safe = true;
  swig.setFilter('marked', markedFilter);

  page_link.safe = true;
  swig.setFilter('page_link', page_link);
};