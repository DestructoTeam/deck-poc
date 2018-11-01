const express = require("express");
const bdd = require("../../bdd/bdd_query.js");

const app = module.exports = express();

app.get("/:id", (req, res) => {
    const list = {
        id: req.params.id,
        name: "List 1",
        cards: [{
          name: "Esclavagiste de l'effroi",
          imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=295556&type=card"
       },{
          name: "Communion avec la lave",
          imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=395577&type=card"
       }]
    };

    res.render(
        'listing/list',
        {list: list}
    );
});

app.post("/:id", (req, res) => {
    bdd.postCard(req.body.id, req.body.list);
});

app.post("/", (req, res) => {
    bdd.postList(req.body.name,
                 req.session.user_id,
                 checkIndex(req.body, "wanted"))
        .then(({success, list_id}) => {
            res.redirect('/list/' + list_id);
        });
});

app.get("/", async (req, res) => {
    let mlist = await bdd.getlist(req.session.user_id);
    res.render(
        'app',
        { lists: mlist }
    );
});

const checkIndex = (obj, val) => {
    if (obj.val)
        return 1;
    else
        return 0;
};
