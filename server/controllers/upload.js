/**
 * Created by Andrew on 1/17/2015.
 */
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var validator = require('express-validator');
var Post = require('../models/Posts');


exports.getUpload = function(req, res) {
  var postId = req.params.id;

  if (postId != null) {
    Post
      .findById(postId)
      .exec(function (err, postData) {
        if (err) console.log(err);
        console.log(postData);
        res.sendFile(postData.filePath, {root: "./"});
      });
  }
  else {
    res.status(200).send("Please give a post ID!")
  }
};

/**
 * POST /upload
 * Upload
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
      console.log( "Number of users:", count );
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

            var webmPatt = new RegExp("/.webm$/");

            // Check if webm file
            if (webmPatt.test(fileName)) {

              console.log("It's a webm file");
              console.log(req.files.file.path.toString('base64'));

            }

            filePath = "./public/uploads/" + fileName;

            fs.writeFile(filePath, data, function (err) {
              if (err) return next(err);

              // Dynamically add name
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
                fileSize: fileSize,
                filePath: filePath
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