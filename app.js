const express = require("express");
const pug = require("pug");
const listing = require("./src/listing/route");

const app = express();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/includes/css"));

app.use("/list", listing);
app.get("/", (req, res) => {
    const lists = [{id: 1, name: "List 1"}, {id: 2, name: "List 2"}, {id: 3, name: "List 3"}];
    res.render(
        'app',
        {lists: lists}
    );
});
app.get("/profile", (req, res) => {
    const profile = [{id: 1, name: "John Doe", email: "john.doe@gmail.com"}];
    res.render(
        'profile',
        {profile: profile}
    );
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
