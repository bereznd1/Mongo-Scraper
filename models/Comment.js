//Requires the Mongoose ORM
var mongoose = require("mongoose");

//Saves a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
var CommentSchema = new Schema({

  name: {
    type: String,
    trim: true,
    required: "Name is Required"
  },


  body: {
    type: String,
    trim: true,
    required: "Comment is Required"
  }

});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Exports the Comment model
module.exports = Comment;
