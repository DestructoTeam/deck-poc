const express = require("express");
const bdd = require("../../bdd/bdd_query");
const matching_check = require("../cards/matching");

const app = module.exports = express();

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

var calculateDistance = function (lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad((lat2 - lat1));
    var dLon = toRad((lon2 - lon1));
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

app.get("/", async (req, res) => {
    let userlist = [];
    res.render(
        'matches',
        { matches: userlist }
    );
});
app.post("/", async (req, res) => {
    await bdd.updateCords(req.body, req.session.user_id);
    res.redirect('/match/' + req.body.list_id);
});
app.get("/:id", async (req, res) => {
    let usercord = await bdd.getCords(req.session.user_id);
    let otheruserlisttmp = await bdd.getOtherCords(req.session.user_id);
    let userlist = []
    if (otheruserlisttmp[0]) {
        for (let i = 0; i < otheruserlisttmp.length; i++) {
            const element = otheruserlisttmp[i];
            let dist = calculateDistance(usercord[0].latitude, usercord[0].longitude, element.latitude, element.longitude);
            if (dist < 2) {
                let tmp = await bdd.getUsers(element.user_id);
                userlist.push(tmp[0]);
            }
        }
    }
    let usrcard = await bdd.getlist(req.session.user_id, req.params.id);
    let finaluserlist = [];
    if (usrcard[0]) {
        let oklist = await matching_check.matchUser(usrcard[0], userlist);
        for (let i = 0; i < oklist.length; i++) {
            let tmp = await bdd.getUsersbylistid(oklist[i].id)
            if (tmp[0] && !(tmp[0] in finaluserlist)){
                finaluserlist.push(tmp[0]);
            }
        }
    }
    res.render(
        'matches',
        { matches: finaluserlist }
    );
});

app.get("/:list_id/matched/:id", async (req, res) => {
    let match = await bdd.getUsers(req.params.id);
    match.cards = [];
    // const match = { id: 1, name: "Johnny Doe", cards: [{ id: 1, name: "Communion avec la lave", imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=395577&type=card" }], messages: [{ id: 1, who: "You", message: "Hi there !" }, { id: 2, who: "Johnny D.", message: "Hi." }] };
    res.render(
        'match',
        { match: match[0] }
    );
});