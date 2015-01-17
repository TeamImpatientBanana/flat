/**
 * Created by Andrew on 1/17/2015.
 */
var bodyParser = require('body-parser');
var Post = require('../models/Posts');
var fs = require('fs');

/**
 * POST /upload
 * Upload
 */

exports.postUpload = function(req, res, next) {

  var fileSize = req.files.file.size;
  var newPath = "";

  // Read file and store it in a new path
  fs.readFile(req.files.file.path, function (err, data) {
    var newPath = "./public/uploads/" + req.files.file.name;

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

  res.send("We gucci");

};