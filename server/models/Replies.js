/**
 * Created by Andrew on 1/17/2015.
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Define schema
var Replies = new Schema({
  comment : String,
  name : {
    type: String,
    default: 'Anonymous'
  },
  dateReplied : {
    type: Date,
    default: Date.now
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Posts'
  }
}, {collection: 'replies'});

module.exports = mongoose.model('Replies', Replies);