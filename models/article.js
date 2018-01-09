var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: "There must be a title to add to DB"
    },
    summary: String,
    link: String,
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
