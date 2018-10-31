function searchCard(name) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log(this.status);
        console.log(this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            console.log("You're in");
            console.log(this.response);
        }
    };
    xhttp.open("GET", "/cards/search/" + name, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}
