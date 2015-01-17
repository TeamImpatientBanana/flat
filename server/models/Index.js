/**
 * Created by Andrew on 1/17/2015.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var db = mongoose.createConnection('127.0.0.1', 'test');
//var pureautoinc  = require('mongoose-pureautoinc');


// Define schema
var Replies = new Schema({
    replyNumber : Number,
    text : String
});

var PostSchema = new Schema({
    name : String,
    fileLocation : String,
    tags : [],
    type : {
        type: String,
        enum: ['video', 'game', 'loop']
    },
    subject : String,
    size : Number,
    datePosted : {
        type: Date,
        default: Date.now
    },
    replies : [Replies]

});

module.exports = mongoose.model('Index', PostSchema);