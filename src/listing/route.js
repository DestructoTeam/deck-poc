const express = require("express");
const bdd = require("../../bdd/bdd_query");
const mtg = require("mtgsdk");

const app = module.exports = express();

app.get("/:id", async (req, res) => {
    let mlist = await bdd.getlist(req.session.user_id, req.params.id);
    mlist[0].cards = [];
    for (let i = 0; i < mlist[0].card_list.length; i++) {
        const element = mlist[0].card_list[i];
        let tmpcard = await mtg.card.find(element);
        mlist[0].cards.push({ name: tmpcard.card.name, imageUrl: tmpcard.card.imageUrl });
    }

    res.render(
        'listing/list',
        { list: mlist[0] }
    );
});

app.post("/:id", (req, res) => {
    bdd.postCard(req.body.id, req.body.list);
});

app.delete("/", async (req, res) => {
    await bdd.deleteList(req.body.listId);
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
