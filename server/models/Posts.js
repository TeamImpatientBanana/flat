/**
 * Created by Andrew on 1/17/2015.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


function subjectValidator(v) {
    return v.length < 64;
}


// Define schema
var Replies = new Schema({
    replyNumber : Number,
    text : String
});

var PostSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    filePath : String,
    tag : {
        type: String,
        enum: ['video', 'game', 'loop'],
        required: true
    },
    subject : {
        type: String,
        validate: [subjectValidator, 'Your subject must be less than 64 characters']
    },
    size : Number,
    datePosted : {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Index', PostSchema);