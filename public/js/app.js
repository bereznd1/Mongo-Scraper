//Requires the Express package to manage the server/routing
var express = require("express");

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

//Activates the express Router to be able to use it with the various routing functions
var router = express.Router();



// $.getJSON("/articles", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
//   });






// router.get("/articles", function(req, res) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
//   });





// router.get("/articles", function(req, res) {
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       var articlesObject = {
//         articles: dbArticle
//       };

//       console.log(articlesObject);

//       //Uses the "index" Handlebars page to load the results of the query into it
//       res.render("index", articlesObject);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });

// });



// // Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });


    

  // // For each one
  // for (var i = 0; i < data.length; i++) {
  //   // Display the apropos information on the page
  //   $("#articles").append(
  //     "<p data-id='" +
  //       data[i]._id +
  //       "'>" +
  //       data[i].title +
  //       "<br />" +
  //       data[i].link +
  //       "<br />" +
  //       data[i].summary +
  //       "</p>"
  //   );
  // }
