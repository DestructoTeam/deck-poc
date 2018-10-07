const express = require("express");

let app = module.exports = express();

app.get("/:id", (req, res) => {
    const list = {
        id: req.params.id,
        name: "Liste",
        cards: [{name: "Squee"}]
    };

    res.render(
        'listing/list',
        {list: list}
    );
});
