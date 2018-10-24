function removeList(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/app", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("listId=" + id);
  document.getElementById("list" + id).remove();
}
