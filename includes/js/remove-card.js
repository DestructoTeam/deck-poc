function removeCard(cardid, listid) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/cards", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("cardId=" + cardid);
    xhttp.send("listId=" + listid);
    document.getElementById("card" + id).remove();
  }
  