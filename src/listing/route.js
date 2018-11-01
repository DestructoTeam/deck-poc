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
    console.log(req.body.id);
    console.log(req.body.list);
    bdd.postCard(req.body.id, req.body.list);
    //res.send(req.body.id);
});
