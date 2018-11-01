const flip = f => a => b => f(b)(a);

const contains = val => xs => xs.indexOf(val) !== -1;

const any = fn => xs => xs.some(fn);

const compareLists =
      list1 =>
      list2 => {
          if (any(flip(contains)(list2))(list1)) return list2;
          return {};
      };
