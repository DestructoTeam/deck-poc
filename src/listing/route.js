const express = require("express");

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
