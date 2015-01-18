/**
 * Created by Andrew on 1/17/2015.
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var postsSchema = new Schema({

    //postid: { type: Number, default: 1 },
    name : {
        type: String,
        default: 'Anonymous'
    },
    comment : String,
    fileName : String,
    tag : {
        type: String,
        enum: ['video', 'game', 'loop']
    },
    subject : String,
    fileSize : Number,
    filePath : String,
    datePosted : {
        type: Date,
        default: Date.now
    },
    replies: [{
        comment : {
            type: String
        },
        name : {
            type: String,
            default: 'Anonymous'
        },
        dateReplied : {
            type: Date,
            default: Date.now
        }
    }]
}, {collection: 'posts'});

/*
Post.pre('save', function(next) {
    var doc = this;
    // You have to know the settings_id, for me, I store it in memory: app.current.settings.id
    Post.findByIdAndUpdate( post_id, { $inc: { postNumber: 1 } }, function (err, settings) {
        if (err) next(err);
        doc.number = settings.postNumber - 1; // subtract 1 because I need the 'current' sequence number, not the next
        next();
    });
});

*/

// Third argument would be the collection name
var Posts = mongoose.model('Posts', postsSchema);
module.exports = Posts;