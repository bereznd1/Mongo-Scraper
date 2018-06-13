// Whenever someone clicks a p tag
$(document).on("click", ".view-comments", function() {
  // // Empty the notes from the note section
  // $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      $("#existing-comments").empty();

      $("#article-title").text(data.title);

      $("#post-button").html(
        ' <button type="button" data-id="' +
          data._id +
          '" class="btn btn-primary post-comment">Post!</button>'
      );
      // $("#summary").text(data.summary);

      // If there's a comment in the article


      if (data.comment) {
        data.comment.forEach(function(element) {
        
          $("#existing-comments").prepend(
            element.name + "<br>" + element.body + "<br><br>"
          );
        });
      }

    });
});





// When you click the savenote button
$(document).on("click", ".post-comment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  console.log(thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      name: $("#name").val(),
      // Value taken from note textarea
      body: $("#comment").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);

      if (data.comment) {

        var lastComment = data.comment.length - 1;
console.log(data.comment);
        
          $("#existing-comments").prepend(

                 
            data.comment[lastComment].name + "<br>" + data.comment[lastComment].body + "<br><br>"
          );
      
      }

      // $("#existing-comment-title").text(data.comment.title);
      // // Place the body of the note in the body textarea
      // $("#existing-comment-body").text(data.comment.body);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#name").val("");
  $("#comment").val("");
});
