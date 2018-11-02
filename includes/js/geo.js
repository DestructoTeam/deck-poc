function geo(list_id) {
    console.log("erf");
    if (!navigator.geolocation || !document.querySelector) {
        alert("you must accept :/");
    } else {
        navigator.geolocation.getCurrentPosition(
            function (p) {
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", "/match", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("list_id=" + list_id + "&latitude=" + p.coords.latitude + "&longitude=" + p.coords.longitude + "&timestamp=" + p.timestamp);
                location.href = "/match/" + list_id;
            }
        )
    }
}