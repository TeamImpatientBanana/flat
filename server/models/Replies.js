/**
 * Created by Andrew on 1/17/2015.
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Define schema
var repliesSchema = new Schema({
  comment : {
    type: String,
    ref: 'Posts'
  },
  name : {
    type: String,
    default: 'Anonymous',
    ref: 'Posts'
  },
  dateReplied : {
    type: Date,
    default: Date.now
  }
});

// Third argument would be the collection name
var Replies = mongoose.model('Replies', repliesSchema);
module.exports = Replies;