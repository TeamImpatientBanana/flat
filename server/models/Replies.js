/**
 * Created by Andrew on 1/17/2015.
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Define schema
var Replies = new Schema({
  replyNumber : Number,
  text : String
}, {collection: 'replies'});

module.exports = mongoose.model('Replies', Replies);