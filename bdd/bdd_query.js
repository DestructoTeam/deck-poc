const bddClass = require('./bdd_connect');
const bcrypt = require('bcrypt');

module.exports.isAuth = async function (email, password) {
    try {
        let bdd = new bddClass();
        result = await bdd.query("SELECT * FROM `users` WHERE `email` = '" + email + "'");
        if (result[0]) {
            pwd_verif = await bcrypt.compare(password, result[0].password);
            bdd.close();
            if (pwd_verif)
                return { auth: true, id: result[0].id, username: result[0].username };
        }

        return { auth: false };
    } catch (error) {
        console.log(error);
    }
}

module.exports.getUsers = async function (user_id) {
    try {
        let bdd = new bddClass();
        let res = [];
        if (typeof user_id === 'undefined')
            res = await bdd.query("SELECT `id`, `email`, `username`, `phone` FROM `users` WHERE 1");
        else
            res = await bdd.query("SELECT `id`, `email`, `username`, `phone` FROM `users` WHERE `id` ='" + user_id + "'");
        bdd.close();
        return res[0];
    } catch (error) {
        console.log(error);
    }
}

module.exports.postUsers = async function (user) {
    try {
        let bdd = new bddClass();
        pwd = await bcrypt.hash(user.password, 13);
        await bdd.query("INSERT INTO `users`(`email`, `username`, `password`, `phone`) VALUES ('"
            + user.email + "','"
            + user.username + "','"
            + pwd + "','"
            + user.phone + "')");
        bdd.close();
        return true;
    } catch (error) {
        console.log(error);
    }
}

module.exports.getlist = async function () {
    try {
        let bdd = new bddClass();
        let res = 'await';
        bdd.close();
        return res;
    } catch (error) {
        console.log(error);
    }
}

module.exports.postList = async function () {
    try {
        let bdd = new bddClass();
        let res = 'await';
        bdd.close();
        return res;
    } catch (error) {
        console.log(error);
    }
}