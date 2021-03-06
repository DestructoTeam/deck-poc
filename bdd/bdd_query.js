const bddClass = require('./bdd_connect');
const bcrypt = require('bcrypt');

module.exports.isAuth = function (email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            result = await bdd.query("SELECT * FROM `users` WHERE `email` = '" + email + "'");
            if (result[0]) {
                pwd_verif = await bcrypt.compare(password, result[0].password);
                bdd.close();
                if (pwd_verif)
                    resolve({ auth: true, id: result[0].id, username: result[0].username });
            }
            resolve({ auth: false });
        } catch (error) {
            console.log(error);
            reject([]);
        }
    });
}

module.exports.getUsersbylistid = function (list_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let res = [];
            res = await bdd.query("SELECT users.id as id, users.email as email, users.username as name, users.phone as phone FROM users INNER JOIN list on list.user_id = users.id WHERE list.user_id ='" + list_id + "'");
            bdd.close();
            resolve(res);
        } catch (error) {
            console.log(error);
            reject([]);
        }
    });
}

module.exports.getUsers = function (user_id, v) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let res = [];
            if (typeof v === 'undefined') {
                res = await bdd.query("SELECT `id`, `email`, `username` as name, `phone` FROM `users`WHERE `id` ='" + user_id + "'");
            }
            else {
                res = await bdd.query("SELECT `id`, `email`, `username` as name, `phone` FROM `users` WHERE `id` !='" + user_id + "'");
            }
            bdd.close();
            resolve(res);
        } catch (error) {
            console.log(error);
            reject([]);
        }
    });
}

module.exports.getlist = function (user_id, list_id = "nope") {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let res = [];
            let list = [];
            if (list_id == "nope") {
                list = await bdd.query("SELECT list.id as list_id, list.name as name, list.wanted as wanted FROM users INNER JOIN list on list.user_id = users.id WHERE users.id ='" + user_id + "'");
            } else {
                list = await bdd.query("SELECT list.id as list_id, list.name as name, list.wanted as wanted FROM users INNER JOIN list on list.user_id = users.id WHERE users.id ='" + user_id + "' AND list.id = '" + list_id + "'");
            }
            if (list[0]) {
                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    let tmp = { id: element.list_id, name: element.name, wanted: element.wanted, card_list: [] };
                    let card_list = await bdd.query("SELECT card.card_id as card_id FROM list INNER JOIN card on card.list_id = list.id WHERE list.id ='" + element.list_id + "'");
                    if (card_list[0]) {
                        card_list.forEach(elem => {
                            tmp.card_list.push(elem.card_id);
                        })
                    }
                    res.push(tmp);
                };
            }
            bdd.close();
            resolve(res);
        } catch (error) {
            console.log(error);
            reject([]);
        }
    });
}

module.exports.getOtherCords = function (user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let qry = await bdd.query("SELECT `user_id`, `latitude`, `longitude`, `timestamp` FROM `latest_coord` WHERE `user_id` != '" + user_id + "'");
            bdd.close();
            resolve(qry);
        } catch (error) {
            console.log(error);
        }
    });
}


module.exports.getCords = function (user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let qry = await bdd.query("SELECT `user_id`, `latitude`, `longitude`, `timestamp` FROM `latest_coord` WHERE `user_id` = " + user_id);
            bdd.close();
            resolve(qry);
        } catch (error) {
            console.log(error);
        }
    });
}

module.exports.updateCords = function (geo, user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            await bdd.query("INSERT INTO `latest_coord`(`user_id`, `latitude`, `longitude`, `timestamp`) VALUES ('"
                + user_id
                + "','" + geo.latitude
                + "','" + geo.longitude
                + "','" + geo.timestamp
                + "') ON DUPLICATE KEY UPDATE `latitude` = '" + geo.latitude
                + "', `longitude` = '" + geo.longitude
                + "', `timestamp` = '" + geo.timestamp + "'");
            bdd.close();
            resolve(true);
        } catch (error) {
            console.log(error);
        }
    });
}

module.exports.updateUsers = function (id, user) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            if (user.name !== '')
                await bdd.query("UPDATE `users` SET `username`='" + user.name + "' WHERE id = " + id);
            if (user.password !== '') {
                let pwd = await bcrypt.hash(user.password, 13);
                await bdd.query("UPDATE `users` SET `password`='" + pwd + "' WHERE id = " + id);
            }
            if (user.email !== '')
                await bdd.query("UPDATE `users` SET `email`='" + user.email + "' WHERE id = " + id);
            if (user.phone !== '')
                await bdd.query("UPDATE `users` SET `phone`='" + user.phone + "' WHERE id = " + id);
            bdd.close();
            resolve({ success: true });
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

// { email: 'h', username: 'h', password: 'h', phone: '0123456789' }
module.exports.postUsers = function (user) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let pwd = await bcrypt.hash(user.password, 13);
            let sql = await bdd.query("INSERT INTO `users`(`email`, `username`, `password`, `phone`) VALUES ('"
                + user.email + "','"
                + user.name + "','"
                + pwd + "','"+
                + user.phone + "')");
            bdd.close();
            resolve({ success: true, user_id: sql.insertId });
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

module.exports.postList = function (name, user_id, wanted) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let sql = await bdd.query("INSERT INTO `list`(`name`, `user_id`, `wanted`) VALUES ('"
                + name + "','"
                + user_id + "','"
                + wanted + "')");
            bdd.close();
            resolve({ success: true, list_id: sql.insertId });
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

module.exports.postCard = function (card_id, list_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            await bdd.query("INSERT INTO `card`(`card_id`, `list_id`) VALUES ('"
                + card_id + "','"
                + list_id + "')");
            bdd.close();
            resolve(true);
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

module.exports.deleteList = function (list_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let card_list = await bdd.query("SELECT card.id as id FROM list INNER JOIN card on card.list_id = list.id WHERE list.id ='" + list_id + "'");
            if (card_list[0]) {
                for (let i = 0; i < card_list.length; i++) {
                    const element = card_list[i];
                    await bdd.query("DELETE FROM `card` WHERE `id` =" + element.id);
                }
            }
            await bdd.query("DELETE FROM `list` WHERE `id` =" + list_id);
            bdd.close();
            resolve(true);
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

module.exports.deleteCard = function (card_id, list_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            await bdd.query("DELETE FROM `card` WHERE `card_id` = " + card_id + " AND `list_id` = " + list_id + " LIMIT 1");
            bdd.close();
            resolve(true);
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

// SELECT list.id as id, list.name as name, list.wanted as wanted, card.card_id as card FROM users INNER JOIN list on list.user_id = users.id INNER JOIN card on card.list_id = list.id


// SELECT card.card_id FROM list INNER JOIN card on card.list_id = list.id