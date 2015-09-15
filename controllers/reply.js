/**
 * Created by Andrew on 1/17/2015.
 */
var bodyParser = require('body-parser');
var Post = require('../models/Posts');
var mongoose = require('mongoose');
var fs = require('fs');
var validator = require('express-validator');


/**
 * GET /reply/:id
 *
 */

exports.getReply = function(req, res) {

  var postId = req.params.id;

  Post
    .findById(postId)
    .sort({'replies.$.dateReplied':1})
    .exec(function(err, postData){
      if (err) console.log(err);
      console.log("Reply data: ");
      console.log(postData);

      res.render('reply', {
        title: 'Reply',
        postData: postData
      });
    });

};


/**
 * POST /reply
 *
 */

exports.postReply = function(req, res) {

  var comment = req.body.comment;
  var name = req.body.name;
  var postId = req.body.postId;


  // validate the inputs
  req.assert('name', 'That name is too long.').len(0,64);
  req.assert('comment', 'Your comment is waaaaay too long.').len(0,500);
  req.assert('comment', 'You have to leave a comment!').notEmpty();

  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) console.log(errors);

  if (errors) {
    res.render('index', {
      flash: {
        type: 'alert-danger',
        messages: errors
      }
    });
  }
  else {

    // Dynamically add name, comment, and subject
    if (name == '') {
      name = 'Anonymous';
    }

    Post.findByIdAndUpdate(postId, {$push: {"replies": {comment: comment, name: name} } }, {safe: true, upsert: true},
      function(err, model) {
        if (err) console.log(err);
        console.log(model.replies);
        res.redirect("back");
      }
    );
  }
};