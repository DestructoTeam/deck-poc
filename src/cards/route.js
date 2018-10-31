const express = require("express");
const mtg = require("mtgsdk");
const R = require('ramda');

const app = module.exports = express();

app.get("/search/:name", (req, res) => {
    const cards = searchCard(req.params.name);
    return cards;
});

const searchCard = (name) => {
    console.log("searching card ...");
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
