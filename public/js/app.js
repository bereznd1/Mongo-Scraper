function viewComments() {
  // Whenever someone clicks a p tag
  $(document).on("click", ".view-comments", function() {
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        $("#existing-comments").empty();

        $("#article-title").text(data.title);

        $("#post-button").html(
          ' <button type="button" data-id="' +
            data._id +
            '" class="btn btn-primary post-comment" data-dismiss="modal">Post!</button>'
        );

        // If there's a comment in the article

        if (data.comment) {
          data.comment.forEach(function(element) {
            $("#existing-comments").prepend(
              "<div class = '" +
                element._id +
                "'><strong>" +
                element.name +
                ": </strong><a class='btn btn-info btn-sm delete-comment' data-id = '" +
                element._id +
                "' style='float: right'><span class='glyphicon glyphicon-remove'></span></a><br>" +
                element.body +
                "<br><hr><br></div>"
            );
          });
        }
      });
  });
}

function postComment() {
  // When you click the savenote button
  $(document).on("click", ".post-comment", function() {
    // Grab the id associated with the article from the Post button
    var thisId = $(this).attr("data-id");

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

    // Also, remove the values entered in the input and textarea for note entry
    $("#name").val("");
    $("#comment").val("");
  });
}

function deleteComment() {
  // When you click the DELETE BUTTON
  $(document).on("click", ".delete-comment", function() {

    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "GET",
      url: "/delete/" + thisId
    })
      // With that done
      .then(function(data) {
        $("." + thisId).remove();
      });
  });
}

viewComments();
postComment();
deleteComment();
