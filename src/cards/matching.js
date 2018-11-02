const bdd = require("../../bdd/bdd_query");
const R = require('ramda');

const flip = f => a => b => f(b)(a);

const contains = val => xs => xs.indexOf(val) !== -1;

const any = fn => xs => xs.some(fn);

const compareLists =
      list1 =>
      list2 => {
          if (list1.wanted === list2.wanted)
              return {};
          if (any(flip(contains)(list2.card_list))(list1.card_list)) return list2;
          return {};
      };

const getId = user => user.id;

module.exports.matchUser = (list, users) => {
    const users_id = R.map(getId, users);
    const users_list = R.map(bdd.getlist, users_id);
    return Promise.all(users_list).then(xs => {
        const lists = xs[0];
        return R.map(compareLists(list), lists);
    });
};
