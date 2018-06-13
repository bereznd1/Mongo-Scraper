var express = require("express");

// Set Handlebars.
var exphbs = require("express-handlebars");

//Set up parsing of info that is sent to the server.
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Our scraping tools

// Makes HTTP request for HTML page
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

//Configures bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Configures Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoMusicScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Routes

//CREATES NEW ARTICLES IN THE ARTICLE COLLECTION FOR EVERY ARTICLE IT SCRAPES OFF THE SITE

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request(
    "https://www.nytimes.com/section/arts/music?action=click&contentCollection=arts&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront",
    function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);

      //FOR EVERY SINGLE ARTICLE H2 ON THE PAGE, WE MAKE AN OBJECT AND CREATE A NEW ARTICLE IN THE DB WITH IT

      // Now, we grab every h2 within an article tag, and do the following:
      $(".story-link").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .find("h2")
          .text();
        result.summary = $(this)
          .find("p")
          .text();
        result.link = $(this).attr("href");

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    }
  );
});

// Route for getting all Articles from the db
app.get("/", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {

    var dbArticleReverse = dbArticle.reverse();

      var articlesObject = {
        articles: dbArticleReverse
      };

      //Uses the "index" Handlebars page to load the results of the query into it
      res.render("index", articlesObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});







        // Route for grabbing a specific Article by id, populate it with it's note
        app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
                    db.Article.findOne({ _id: req.params.id })
                        // ..and populate all of the notes associated with it
                        .populate("comment")

                        .then(function(dbArticle) {
                            // If we were able to successfully find an Article with the given id, send it back to the client
                            res.json(dbArticle);
                            console.log(dbArticle);
                          })
                          .catch(function(err) {
                            // If an error occurred, send it to the client
                            res.json(err);
                          });
                      });







// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: dbComment._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
      console.log(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});




// Route for deleting an Article's associated Note
app.get("/delete/:id", function(req, res) {

    db.Comment.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            res.json(err);
        }
        // deleted at most one tank document
      });
  
  });





// db.Note.create(req.body)
// .then(function(dbNote) {
//   // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//   // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//   // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//   return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
// })
// .then(function(dbArticle) {
//   // If we were able to successfully update an Article, send it back to the client
//   res.json(dbArticle);
// })
// .catch(function(err) {
//   // If an error occurred, send it to the client
//   res.json(err);
// });







// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//       .then(function(dbNote) {
//         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });












// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
