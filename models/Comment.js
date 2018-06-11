var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var CommentSchema = new Schema({

  // `title` is of type String
  title: {
    type: String,
    trim: true,
    required: "Title is Required"
  },

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

// Export the Note model
module.exports = Comment;
