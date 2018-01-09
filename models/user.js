var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    firstName: {
        type: String,
        required: "You must enter your first name."
    },
    lastName: {
        type: String,
        required: "You must enter a last name."
    },
    password: {
        type: String,
        minLength: 6,
        required: "You must have a password."
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please enter a valid e-mail address"],
        unique: true
    },
    articles: [{
        type: Schema.Types.ObjectId,
        ref: "Article"
    }]
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
