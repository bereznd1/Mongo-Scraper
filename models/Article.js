var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    unique: true,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    unique: true,
    required: true
  },


  summary: {
    type: String,
    unique: true,
    required: true
  },



  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note

  //This isnt an array like in the other examples bc we only have 1 note for each article, not an array of notes
  comment: {

    //"Schema.Types.ObjectID" is a special mongoose type that finds the ID of that item in the collection
    type: Schema.Types.ObjectId,

    //this looks into that collection & finds the ID of each item in it
    ref: "Comment"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
