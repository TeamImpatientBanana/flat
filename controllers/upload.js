/**
 * Created by Andrew on 1/17/2015.
 */
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var validator = require('express-validator');
var Post = require('../models/Posts');
var path = require('path');


/**
 * GET /upload/:id
 * Get uploads by their id
 */

exports.getUpload = function(req, res) {
  var postId = req.params.id;

  // Check if an id was passed as a parameter
  if (postId) {

    Post
      .findById(postId)
      .exec(function (err, postData) {
        if (err) console.log(err);
        res.sendFile(postData.fileName, {root: path.resolve(__dirname, "../public/uploads")});
      });
  }
  else {
    res.send("Please give a post ID!")
  }
};


/**
 * POST /upload
 * File Upload
 */

exports.postUpload = function(req, res, next) {

  var fileSize = req.files.file.size;
  var filePath = "";
  var fileName = req.files.file.name;
  var tag = req.body.tag;
  var name = req.body.name;
  var subject = req.body.subject;
  var comment = req.body.comment;

  // validate the inputs
  req.assert('name', 'That name is too long.').len(0,64);
  req.assert('comment', 'Your comment is waaaaay too long.').len(0,300);
  req.assert('subject', 'Your subject is waaaaay too long.').len(0,64);

  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('index', {
      flash: {
        type: 'alert-danger',
        messages: errors
      }
    });
  }
  else {

    // Check for duplicate filename
    Post.count({fileName: fileName}, function( err, count){
      if (count != 0) {
        errors = [
          {
            msg: 'There is already a file with that name.'
          }
        ];
        res.render('index', {
          flash: {
            type: 'alert-danger',
            messages: errors
          }
        });
      }
      else {
        // Check if filesize is over 20 MB
        if (fileSize > 52428800) {
          errors = [
            {
              msg: 'Your file must be under 50 MB'
            }
          ];
          res.render('index', {
            flash: {
              type: 'alert-danger',
              messages: errors
            }
          });
        }
        else {

          // Read file and store it in a new path
          fs.readFile(req.files.file.path, function (err, data) {
            if (err) console.log(err);

            // __dirname is the directory of the executing script, not of app.js!
            filePath = path.resolve(__dirname, '../public/uploads') + "/" + fileName;
            console.log(filePath);

            fs.writeFile(filePath, data, function (err) {
              if (err) return next(err);

              // If a name isn't entered, the name will be anonymous
              if (name == '') {
                name = 'Anonymous';
              }

              // Define what to save according to the Posts Schema
              var newPost = new Post({
                name: name,
                comment: comment,
                subject: subject,
                fileName: fileName,
                tag: tag,
                fileSize: fileSize
              });

              newPost.save(function(err) {
                if (err) {
                  console.log(err);
                  return next(err);
                }
              });
              res.redirect("back");
            });
          });
        }
      }
    });
  }
};
