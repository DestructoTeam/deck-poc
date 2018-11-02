const express = require("express");
const pug = require("pug");
const listing = require("./src/listing/route");
const match = require("./src/matches/matches");
const cards = require("./src/cards/route.js");
const bodyParser = require("body-parser");
const bdd = require("./bdd/bdd_query");
const session = require('express-session');

const app = express();

app.set("view engine", "pug");

app.use(express.static(__dirname + "/includes"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'wololo this a secret',
    resave: false,
    saveUninitialized: true,
}));

function isAuthenticated(req, res, next) {
    if (req.session.user_id)
        return next();

    res.redirect('/');
}

app.get("/", (req, res) => {
    res.render('sing');
});

app.use("/list", isAuthenticated, listing);

app.use("/cards", isAuthenticated, cards);

app.use("/match", isAuthenticated, match);

app.get("/sing", (req, res) => { //login first render
    res.render('sing');
});

app.post("/sing", async (req, res) => { //login post
    let auth = await bdd.isAuth(req.body.email, req.body.password);
    if (auth.auth) {
        req.session.user_id = auth.id;
        req.session.user_name = auth.username;
        let mlist = await bdd.getlist(auth.id);
        res.redirect('/app');
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
        res.redirect('/app');
    } else {
        res.render('sung');
    }
});

app.get("/app", isAuthenticated, async (req, res) => {
    let mlist = await bdd.getlist(req.session.user_id);
    res.render(
        'app',
        { lists: mlist }
    );
});
app.delete("/app", isAuthenticated, async (req, res) => {
    await bdd.deleteList(req.body.listId);
});
app.get("/user", isAuthenticated, async (req, res) => {
    const profile = await bdd.getUsers(req.session.user_id);
    let owned = true
    res.render(
        'profile',
        { profile: profile[0], owned: owned }
    );
});
app.get("/user/:id", isAuthenticated, async (req, res) => {
    const profile = await bdd.getUsers(req.params.id);
    let owned = false
    if (req.params.id == req.session.user_id)
        owned = true
    if (profile[0]) {
        res.render(
            'profile',
            { profile: profile[0], owned: owned }
        );
    } else {
        res.redirect('/app');
    }

});
app.get("/profiledit", isAuthenticated, async (req, res) => {
    const profile = await bdd.getUsers(req.session.user_id);
    res.render(
        'profiledit',
        { profile: profile }
    );
});
app.post("/profiledit", isAuthenticated, async (req, res) => {
    await bdd.updateUsers(req.session.user_id, req.body);
    res.redirect('/profile');
});

app.get("*", (req, res) => {
    res.redirect('/app');
});

app.post("*", (req, res) => {
    res.redirect('/app');
});

app.listen("8000");
