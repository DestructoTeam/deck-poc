// $('#remove-list').on('click', function() {
//   var userId = $(this).attr('data-id');
//   console.log("zqsdq");
//   $.ajax({
//     method: "POST",
//     url: "/app",
//     data: {"id": userId},
//     success: function(result) {
//       location.reload();
//     }
//   });
// });

function removeList(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/app", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("listId=" + id);
  document.getElementById("list" + id).remove();
}
