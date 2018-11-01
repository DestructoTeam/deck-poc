function searchCard(name) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("ourContainer").innerHTML = "";
            const obj = JSON.parse(this.response);
            const documentFragment = document.createDocumentFragment();
            obj.cards.forEach(function(element) {
                if (typeof element.url !== "undefined") {
                    var cardFragment = document.createElement('div');
                    var img = document.createElement('IMG');
                    var but = document.createElement('button');
                    cardFragment.appendChild(document.createElement('p')).innerHTML = element.name;
                    img.setAttribute('src', element.url);
                    but.setAttribute('class', "btn btn-primary");
                    but.setAttribute('style', "font-size:2rem;");
                    cardFragment.appendChild(img);
                    cardFragment.appendChild(but).innerHTML = "Add";
                    documentFragment.appendChild(cardFragment);
                }
            });
            document.getElementById("ourContainer").appendChild(documentFragment);
        }
    };
    xhttp.open("GET", "/cards/search/" + name, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}
