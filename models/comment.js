var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
    body: {
        type: String,
        required: "There must be a comment body"
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
