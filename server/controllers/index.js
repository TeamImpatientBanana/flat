var bodyParser = require('body-parser');
var Post = require('../models/Index');
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


/**
 * POST /
 * Home page.
 */

exports.postUpload = function(err, req, res, next) {

  var file = req.files.file;
  var fileSize = file.size;
  var newPath = "";

  // Read file and store it in a new path
  fs.readFile(file.path, function (err, data) {
    var newPath = "./public/uploads/" + file.name;

    fs.writeFile(newPath, data, function (err) {
      if (err) return next(err);
    });
  });

  // Define what to save according to the Post Schema
  var post = new Post({
    name: req.body.name,
    filePath: newPath,
    tag: req.body.tag,
    subject: req.body.subject,
    size: fileSize
  });

  post.save(function(err) {
    if (err) return next(err);

  });

};

exports.postReply = function(req, res, next) {



};