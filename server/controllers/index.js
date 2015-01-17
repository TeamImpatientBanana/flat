var bodyParser = require('body-parser');
var Post = require('../models/Posts');
var fs = require('fs');


/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('index', {
    title: 'Home'
  });
};

exports.getReply = function(req, res) {
  res.render('reply', {
    title: 'Reply'
  });
};