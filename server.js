//Requiring necessary packages

//Handles routing
var express = require("express");

//Handles templating
var exphbs = require("express-handlebars");

//Sets up parsing of info that is sent to the server.
var bodyParser = require("body-parser");

//Sets up ORM for interacting with MongoDB.
var mongoose = require("mongoose");



//Our scraping tools

//Makes HTTP request for HTML page
var request = require("request");

//Scrapes the contents of a page
var cheerio = require("cheerio");

//Requires all models
var db = require("./models");

//Sets up a port for the app to run on
var PORT = 3000;

//Initializes Express
var app = express();



//Configuring middleware

//Configures bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Configures Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Allows the app to use express.static to serve the public folder as a static directory
app.use(express.static("public"));



//Connecting to the DB

//If deployed, use the deployed database. Otherwise use the local mongoMusicScraper database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoMusicScraper";

//Sets mongoose to leverage built in JavaScript ES6 Promises
//Connects to the Mongo DB
mongoose.Promise = Promise;






//Routes

//Creates new articles in the Article collection for every article the app scrapes off the site
app.get("/scrape", function(req, res) {
  //Sends a request out to the desired URL
  request(
    "https://www.nytimes.com/section/arts/music?action=click&contentCollection=arts&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront",

    //When the request goes through...
    function(error, response, html) {
      //The HTML that is returned is loaded into cheerio and saved to "$" for a shorthand selector
      var $ = cheerio.load(html);

      //Grabs every ".story-link" within the page...
      $(".story-link").each(function(i, element) {
        //Saves an empty result object
        var result = {};

        //Add the title, summary, and link of every article and saves them as properties of the result object
        result.title = $(this)
          .find("h2")
          .text();
        result.summary = $(this)
          .find(".summary")
          .text();
        result.link = $(this).attr("href");

        //Creates a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            //Logs the added article in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            //If an error occurs, log it
            console.log(err);
          });
      });

      //Loads up the "Scraped" page after scraping is complete
      res.render("scraped", {});
    }
  );
});





//Gets all Articles from the DB
app.get("/", function(req, res) {
  //Grabs every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      //Creates an object built from the results of the query
      var articlesObject = {
        articles: dbArticle
      };

      //Uses the "index" Handlebars page to load the results of the query into it
      res.render("index", articlesObject);
    })
    .catch(function(err) {
      //If an error occurrs, sends it to the client
      res.json(err);
    });
});





//Grabs a specific Article by ID & populates it with its Comments
app.get("/articles/:id", function(req, res) {
  //Using the ID passed into the ID parameter, prepares a query that finds the Article with the matching ID in the DB...
  db.Article.findOne({ _id: req.params.id })

    //...and populates all of the Comments associated with it
    //This supplies the rest of the Comments' property values to the Article besides just its ID, which was the only Comment property pushed to the Article's Comments array originally
    .populate("comment")

    .then(function(dbArticle) {
      //If we were able to successfully find an Article with the given ID, sends it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      //If an error occurs, sends it to the client
      res.json(err);
    });
});





//Saves an Article's associated Comment
app.post("/articles/:id", function(req, res) {
  //Creates a new comment using the information submitted
  db.Comment.create(req.body)

    .then(function(dbComment) {
      //If a Comment was created successfully, finds one Article with an `_id` equal to `req.params.id`
      //Pushes the new Comment into that Article's "Comment" array
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: dbComment._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      //If we were able to successfully update an Article, sends it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      //If an error occurs, sends it to the client
      res.json(err);
    });
});






//Deletes a comment
app.get("/delete/:id", function(req, res) {
  //Queries the Comment collection for a comment with the specified ID
  db.Comment.findOneAndRemove({ _id: req.params.id })

    .then(function(dbDeleted) {
      //If the query was succesful, send the deleted comment back to the client
      res.json(dbDeleted);
    })
    .catch(function(err) {
      //If an error occurs, sends it back to the client
      res.json(err);
    });
});




mongoose.connect(MONGODB_URI);

//Starts the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
