var bodyParser = require('body-parser');
var Posts = require('../models/Index');

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('index', {
    title: '/f/lat'
  });
};


/**
 * POST /
 * Home page.
 */

exports.postUpload = function(req, res) {

};

exports.postReply = function(req, res) {



};