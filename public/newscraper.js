$(document).on("click", ".submitComment", function() {
    console.log("a click happened");
    var thisId = $(this).attr("data-id");
    console.log("#bodyInput");
    $.ajax({
            method: "POST",
            url: "/articles_dash/comments/" + thisId,
            data: {
                body: $("#commentText").val()
            }
        })
        .done(function(data) {
            console.log(data);
            // location.reload();
            // $("#notes").empty();
        });
    $("#bodyinput").val("");
});

$(document).on("click", ".clickToComment", function() {
    var thisid = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles_dash/comments/" + thisid
    });
});
