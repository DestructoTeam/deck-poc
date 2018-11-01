const express = require("express");
const mtg = require("mtgsdk");
const R = require('ramda');

const app = module.exports = express();

const searchCard = (name) => {
    console.log("searching card <" + name + "> ...");
    return mtg.card.where({name: name})
        .then(cards => {
            const res = R.map((card) => {
                return {
                    name: card.name,
                    url: card.imageUrl,
                    id: card.multiverseid
                };
            }, cards);
            return {cards: res};
        });
};

app.get("/search/:name", (req, res) => {
    searchCard(req.params.name)
        .then(cards => {
            res.send(cards);
        });
});
