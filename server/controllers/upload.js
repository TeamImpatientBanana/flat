/**
 * Created by Andrew on 1/17/2015.
 */
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var validator = require('express-validator');
var Post = require('../models/Posts');

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

  console.log(fileSize);

  // validate the inputs
  //req.assert('name', 'Name is required.').notEmpty();
  req.assert('name', 'That name is too long.').len(0,32);
  //req.assert('file', 'You gotta upload a file!').notEmpty();
  req.assert('comment', 'Your comment is waaaaay too long.').len(0,100);
  req.assert('subject', 'Your subject is waaaaay too long.').len(0,64);

  // check the validation object for errors
  var errors = req.validationErrors();

  console.log(errors);

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

            filePath = "./public/uploads/" + fileName;

            console.log(fileName);
            console.log(filePath);
            console.log(fileSize);

            fs.writeFile(filePath, data, function (err) {
              if (err) return next(err);

              // Define what to save according to the Post Schema
              var newPost = new Post({
                //name: name,
                //comment: comment,
                fileName: fileName,
                tag: tag,
                //subject: subject,
                fileSize: fileSize
              });

              // Dynamically add name, comment, and subject
              if (name != '') {
                newPost.add({name: name});
              }
              if (comment != '') {
                newPost.add({comment: comment});
              }
              if (subject != '') {
                newPost.add({subject: subject});
              }

              console.log("oy");
              console.log(newPost);

              newPost.save(function(err) {
                console.log("yo");
                if (err) {
                  console.log(err);
                  return next(err);
                }
                console.log("Saved post");

              });

              res.redirect("back");

            });
          });
        }
      }
    });
  }
};