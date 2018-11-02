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
                    var titleCard = document.createElement('div');
                    var card = document.createElement('div');
                    var button = document.createElement('div');

                    var title = document.createElement('p');
                    var img = document.createElement('IMG');
                    var but = document.createElement('button');

                    cardFragment.setAttribute('class', "row");
                    cardFragment.setAttribute('style', "margin-top:30px;");

                    titleCard.setAttribute('class', "row col-md-12");
                    title.setAttribute('style', "font-size:2rem; padding-left:1.275rem;");
                    titleCard.appendChild(title).innerHTML = element.name;

                    card.setAttribute('class', "row col-md-8");

                    button.setAttribute('class', "row col-md-4");

                    img.setAttribute('src', element.url);
                    img.setAttribute('class', "rounded mx-auto d-block");
                    img.setAttribute('style', "margin-top:30px; margin-bottom:30px;width:230px;height:310px;");

                    but.setAttribute('class', "btn btn-primary");
                    but.setAttribute('type', "button");
                    but.setAttribute('onclick', 'addCard(' + element.id + ', "' + element.url + '", "' + element.name + '")');
                    but.setAttribute('style', "font-size:2rem; align-self:center;");

                    card.appendChild(img);
                    button.appendChild(but).innerHTML = "Add";

                    cardFragment.appendChild(titleCard);
                    cardFragment.appendChild(card);
                    cardFragment.appendChild(button);

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

function addCard(id, url, name) {
    const rgx = /[^/]+$/;
    var xhttp = new XMLHttpRequest();

    document.getElementById("toRemove").innerHTML = "";

    const row = document.createElement('div');
    const rowName = document.createElement('div');
    const rowUrl = document.createElement('div');
    const rowText = document.createElement('div');

    var nameDiv = document.createElement('p');
    var buttonDiv = document.createElement('button');
    var closeDiv = document.createElement('span');
    var urlDiv = document.createElement('IMG');
    var textDiv = document.createElement('p');

    nameDiv.setAttribute('class', "offset-md-1 col-md-9");
    nameDiv.setAttribute('style', "font-size:3rem;");
    nameDiv.innerHTML = name;

    buttonDiv.setAttribute('class', "close col-md-2");
    buttonDiv.setAttribute('type', "button");
    buttonDiv.setAttribute('onclick', "removeCard("+ id +", " + rgx.exec(document.URL) + ");");
    buttonDiv.setAttribute('aria-label', "Close");

    closeDiv.setAttribute('aria-hidden', "true");
    closeDiv.innerHTML = "&times;";

    urlDiv.setAttribute('class', "rounded mx-auto d-block");
    urlDiv.setAttribute('style', "margin-top:30px; margin-bottom:30px;");
    urlDiv.setAttribute('src', url);

    textDiv.setAttribute('style', "align-self:center;");
    textDiv.innerHTML = "Added";

    buttonDiv.appendChild(closeDiv);
    rowName.appendChild(nameDiv);
    rowName.appendChild(buttonDiv);

    rowUrl.appendChild(urlDiv);

    rowText.appendChild(textDiv);

    row.setAttribute('class', "row row-list");
    row.setAttribute('id', "card" + id);
    rowName.setAttribute('class', "row col-md-12");
    rowUrl.setAttribute('class', "row col-md-8");
    rowText.setAttribute('class', "row col-md-4");

    row.appendChild(rowName);
    row.appendChild(rowUrl);
    row.appendChild(rowText);

    document.getElementById("cardList").insertBefore(row, document.getElementById("cardList").childNodes[0]);

    xhttp.open("POST", '/list/' + rgx.exec(document.URL), true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + id + "&list=" + rgx.exec(document.URL));
}
