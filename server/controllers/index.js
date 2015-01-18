var bodyParser = require('body-parser');
var Post = require('../models/Posts');
var mongoose = require('mongoose');
var fs = require('fs');


/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {

  Post
    .find({})
    .sort('-datePosted')
    .limit(20)
    .select('_id name fileName tag subject fileSize datePosted')
    .exec(function(err, postsData) {
      if (err) console.log(err);

      console.log(postsData);


      res.render('index', {
        title: 'Home',
        posts: postsData
      });

    });


};