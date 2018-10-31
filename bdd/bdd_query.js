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
                res = await bdd.query("SELECT `id`, `email`, `username`, `phone` FROM `users`");
            }
            else {
                res = await bdd.query("SELECT `id`, `email`, `username`, `phone` FROM `users` WHERE `id` ='" + user_id + "'");
            }
            bdd.close();
            resolve(res);
        } catch (error) {
            console.log(error);
            reject([]);
        }
    });
}

module.exports.getlist = function (user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            let res = [];
            let list = await bdd.query("SELECT list.id as list_id, list.name as name, list.wanted as wanted FROM users INNER JOIN list on list.user_id = users.id WHERE users.id ='" + user_id + "'");
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

// { email: 'h', username: 'h', password: 'h', phone: '0123456789' }
module.exports.postUsers = function (user) {
    return new Promise(async (resolve, reject) => {
        try {
            let bdd = new bddClass();
            pwd = await bcrypt.hash(user.password, 13);
            await bdd.query("INSERT INTO `users`(`email`, `username`, `password`, `phone`) VALUES ('"
                + user.email + "','"
                + user.username + "','"
                + pwd + "','"
                + user.phone + "')");
            bdd.close();
            resolve(true);
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