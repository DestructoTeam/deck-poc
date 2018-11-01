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

module.exports.getUsers = function (user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let res = [];
            if (typeof user_id === 'undefined') {
                res = await bdd.query("SELECT `id`, `email`, `username` as name, `phone` FROM `users`");
            }
            else {
                res = await bdd.query("SELECT `id`, `email`, `username` as name, `phone` FROM `users` WHERE `id` ='" + user_id + "'");
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
            console.log(list_id);
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

module.exports.updateUsers = function (user) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let pwd = await bcrypt.hash(user.password, 13);
            let sql = await bdd.query("INSERT INTO `users`(`email`, `username`, `password`, `phone`) VALUES ('"
                + user.email + "','"
                + user.name + "','"
                + pwd + "','NULL')");
            // + typeof user.phone == undefined ? 'NULL' : user.phone + "')");
            bdd.close();
            resolve({ success: true, user_id: sql.insertId });
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

// { email: 'h', username: 'h', password: 'h', phone: '0123456789' }
module.exports.postUsers = function (id, user) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            if (typeof user.name !== undefined)
                await bdd.query("UPDATE `users` SET `username`='" + user.name + "' WHERE id = " + id);
            if (typeof user.password !== undefined) {
                let pwd = await bcrypt.hash(user.password, 13);
                await bdd.query("UPDATE `users` SET `password`='" + pwd + "' WHERE id = " + id);
            }
            if (typeof user.email !== undefined)
                await bdd.query("UPDATE `users` SET `email`='" + user.email + "' WHERE id = " + id);
            if (typeof user.phone !== undefined)
                await bdd.query("UPDATE `users` SET `phone`='" + user.phone + "' WHERE id = " + id);
            bdd.close();
            resolve({ success: true });
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
            await bdd.query("INSERT INTO `list`(`name`, `user_id`, `wanted`) VALUES ('"
                + name + "','"
                + user_id + "','"
                + wanted + "')");
            bdd.close();
            resolve(true);
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
            await bdd.query("DELETE FROM `card` WHERE `card_id` = " + card_id + " AND `list_id` = " + list_id);
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