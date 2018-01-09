var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var path = require("path");
var exphbs = require("express-handlebars");
var helpers = require('handlebars-helpers')();

var PORT = 8080;
var User = require("./models/user.js");
var Article = require("./models/article.js");
var Comment = require("./models/comment.js");
// var db = mongoose.connection;
var app = express();

//MIDDLEWARE
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('views', './views');
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine', '.hbs');
app.set("view engine", "handlebars");

// MONGO
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newscraperDB";
mongoose.connect(MONGODB_URI);

// ROUTES
app.post("/signin", function(req, res) {
    var user = new User(req.body);
    User.create(user)
        .then(function(newUser) {
            res.redirect("/articles_json");
            res.json(newUser);
            console.log(newUser);
        })
        .catch(function(err) {
            res.json(err);
        });
    // res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/articles_json", function(req, res) {
    request("https://www.vice.com/en_us", function(error, response, html) {
        var $ = cheerio.load(html);
        var results = {};
        $("a.grid__wrapper__card").each(function(i, element) {
            var title = $(element).find(".grid__wrapper__card__text__title").text();
            var summary = $(element).find(".grid__wrapper__card__text__summary").text();
            var link = $(element).attr("href");
            // var image = $(element).attr("src");
            // console.log("this is the image: " + image);
            results = {
                title: title,
                summary: summary,
                link: link
            };
            // console.log("Results line 54: " + results);
            Article
                .create(results)
                .then(function(dbArticle) {
                    res.redirect("/articles_dash");
                    // console.log("Articles line 59: " + dbArticle);
                })
                .catch(function(err) {
                    res.json(err);
                });
        });
    });
});

app.get("/articles_dash", function(req, res) {
    Article.find({})
        .then(function(data) {
            var articles = data.slice(0, 6);
            // console.log("data.title " + data.Article.title)
            var hbsObject = { data: articles };
            console.log("This is the handlesbars Object: " + "%0", hbsObject);
            res.render("index", hbsObject);
        });
});

app.post("/articles_dash/comments/:id", function(req, res) {
    console.log(req.body);
    Comment.create(req.body)
        .then(function(note) {
            console.log("This is the note? " + note);
            return Article.findOneAndUpdate({ _id: req.params.id }, { comment: note._id }, { new: true });
        })
        .then(function(article) {
            console.log("This is the updated article? " + article);
            res.redirect("/articles_dash");
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/articles_dash/comments/:id", function(req, res) {
    Article.findById({ _id: req.params.id })
        .populate("comment")
        .then(function(data) {
            console.log(data);
            var hbsObject = { data: data };
            res.render("comment", hbsObject);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
