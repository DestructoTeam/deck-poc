const express = require("express");
const pug = require("pug");


let app = express();
app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render('app');
});

app.listen("8000");
