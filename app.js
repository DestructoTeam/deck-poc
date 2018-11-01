const express = require("express");
const pug = require("pug");
const listing = require("./src/listing/route");
const cards = require("./src/cards/route.js");
const bodyParser = require("body-parser");
const bdd = require("./bdd/bdd_query");
var session = require('express-session');

const app = express();

app.set("view engine", "pug");

app.use(express.static(__dirname + "/includes"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'wololo this a secret',
    saveUninitialized: true,
}))

app.get("/", (req, res) => {
    res.render('sing');
});
app.use("/list", listing);

app.use("/cards", cards);

app.get("/sing", (req, res) => { //login first render
    res.render('sing');
});
app.post("/sing", async (req, res) => { //login post
    let auth = await bdd.isAuth(req.body.email, req.body.password);
    if (auth.auth) {
        req.session.user_id = auth.id;
        req.session.user_name = auth.username;
        let mlist = await bdd.getlist(auth.id);
        console.log(mlist);
        res.render(
            'app',
            { lists: mlist }
        );
    } else {
        res.render('sing');
    }
});
app.get("/sung", (req, res) => { //register first render
    res.render('sung');
});
app.post("/sung", async (req, res) => { //register post
    let v = await bdd.postUsers(req.body);
    if (v.success) {
        req.session.user_id = v.id;
        req.session.user_name = req.body.name;
        res.render(
            'app',
            { lists: [] }
        );
    } else {
        res.render('sung');
    }
});
app.get("/app", async (req, res) => {
    console.log("haha!", req.session.user_id, req.session.user_name);
    if (req.session.user_id) {
        let mlist = await bdd.getlist(req.session.user_id);
        console.log(mlist);
        res.render(
            'app',
            { lists: mlist }
        );
    } else {
        res.render('sing');
    }
});
app.get("/profile", (req, res) => {
    if (req.session.user_id) {
        const profile = bdd.getUsers(req.session.user_id);
        res.render(
            'profile',
            { profile: profile }
        );
    } else {
        res.render('sing');
    }
});
app.get("/matches", (req, res) => {
    const matches = [{ id: 1, name: "Johnny Doe" }, { id: 2, name: "Jane Doe" }];
    res.render(
        'matches',
        { matches: matches }
    );
});
app.get("/match", (req, res) => {
    const match = { id: 1, name: "Johnny Doe", cards: [{ id: 1, name: "Communion avec la lave", imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=395577&type=card" }], messages: [{ id: 1, who: "You", message: "Hi there !" }, { id: 2, who: "Johnny D.", message: "Hi." }] };
    res.render(
        'match',
        { match: match }
    );
});


app.listen("8000");
