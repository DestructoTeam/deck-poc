const express = require("express");
const pug = require("pug");
const listing = require("./src/listing/route");
const cards = require ("./src/cards/route.js");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "pug");

app.use(express.static(__dirname + "/includes"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.render('sing');
});

app.use("/list", listing);

app.use("/cards", cards);

app.get("/sing", (req, res) => {
    res.render('sing');
});
app.get("/app", (req, res) => {
    res.render(
        'app',
        {lists:[{id: 1, name: "List 1"}, {id: 2, name: "List 2"}, {id: 3, name: "List 3"}]}
    );
});
app.get("/profile", (req, res) => {
    const profile = [{id: 1, name: "John Doe", email: "john.doe@gmail.com"}];
    res.render(
        'profile',
        {profile: profile}
    );
});
app.get("/sung", (req, res) => {
    res.render('sung');
});
app.get("/matches", (req, res) => {
    const matches = [{id: 1, name: "Johnny Doe"}, {id: 2, name: "Jane Doe"}];
    res.render(
        'matches',
        {matches: matches}
    );
});
app.get("/match", (req, res) => {
    const match = {id: 1, name: "Johnny Doe", cards: [{id: 1, name: "Communion avec la lave", imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=395577&type=card"}], messages: [{id: 1, who: "You", message: "Hi there !"}, {id: 2, who: "Johnny D.", message: "Hi."}]};
    res.render(
        'match',
        {match: match}
    );
});


app.listen("8000");
