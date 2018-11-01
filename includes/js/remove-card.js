function removeCard(cardId, listId) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/cards", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("cardId=" + cardId + "&listId=" + listId);
    document.getElementById("card" + cardId).remove();
}
