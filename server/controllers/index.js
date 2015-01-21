var bodyParser = require('body-parser');
var Post = require('../models/Posts');
var mongoose = require('mongoose');
var fs = require('fs');


/**
 * GET /
 * Home page
 */

exports.index = function(req, res) {

  // Find the top 20 posts and sort them by most recently posted
  Post
    .find({})
    .sort('-datePosted')
    .limit(20)
    .select('_id name fileName tag subject fileSize datePosted')
    .exec(function(err, postsData) {
      if (err) eventHandle(err);

      console.log(postsData);

      // Send postsData as a JSON object for our view to do fun things with
      res.render('index', {
        title: 'Home',
        posts: postsData
      });

    });


};