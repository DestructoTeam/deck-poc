const express = require("express");
const pug = require("pug");
const listing = require("./src/listing/route");

let app = express();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/includes/css"));

app.use("/list", listing);
app.get("/", (req, res) => {
    let lists = [{id: 1, name: "Liste1"}, {id: 2, name: "Liste2"}, {id: 3, name: "Liste3"}];
    res.render(
        'app',
        {lists: lists}
    );
});

app.listen("8000");
