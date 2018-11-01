function removeList(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/list", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("listId=" + id);
  document.getElementById("list" + id).remove();
}
