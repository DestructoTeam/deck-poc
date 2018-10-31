$('#remove-list').on('click', function() {
  var userId = $(this).attr('data-id');
  console.log("zqsdq");
  $.ajax({
    method: "POST",
    url: "/app",
    data: {"id": userId},
    success: function(result) {
      location.reload();
    }
  });
});
