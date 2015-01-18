/**
 * Created by Andrew on 1/17/2015.
 */
var bodyParser = require('body-parser');
var Post = require('../models/Posts');
var Reply = require('../models/Replies');
var mongoose = require('mongoose');
var fs = require('fs');
var validator = require('express-validator');


exports.getReply = function(req, res) {

  var postId = req.params.id;

  Post
    .findOne({_id: postId})
    .sort('datePosted')
    .select('_id name comment fileName _replies')
    .populate('_replies', 'name comment dateReplied')
    .exec(function(err, data){
      if (err) console.log(err);
      console.log(data);
    });


  res.render('reply', {
    title: 'Reply'
  });
};

exports.postReply = function(req, res, next) {

  var comment = req.body.comment;
  var name = req.body.name;

  // validate the inputs
  req.assert('name', 'That name is too long.').len(0,64);
  req.assert('comment', 'Your comment is waaaaay too long.').len(0,500);
  req.assert('comment', 'You have to leave a comment!').notEmpty();

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

    // Define what to save according to the Replies Schema
    var newReply = new Reply({
      comment: comment
    });

    // Dynamically add name
    if (name != '') {
      newReply.add({name: name});
    }

    newReply.save(function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
    });
    res.redirect("back");
  }
};