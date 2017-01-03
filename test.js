let _ = require('underscore');

let x = '1234566';

let y = x.substr(0, 10);

// console.info('y', y);

const obj = {
    config: {
        fileName: 'name'
    },
    papers: [
        {
            key: '123', createdAt: 123, updatedAt: 456, text: 'xxxoooxxxooo...'
        },
        {
            key: '124', createdAt: 123, updatedAt: 456, text: 'xxxoooxlllllllxxooo...'
        }
    ]
}

// console.info(JSON.stringify(obj));

// const s = '';
//
// console.info(s !== '');
// console.info(s !== null);
//
// console.info(!!s);
//
// if (s) {
//     console.log(false);
// } else {
//     console.log(true)
// }
//
// console.info(s.length);
//
// if (s) {
//     console.info(s.length);
// } else {
//     console.info(false);
// }

let str = ' mwo\nlk';

//let res = /str/.exec('(.*)\s.*');

// let res = str.match(/(.*?)(\s|\b|\n|\f|\r|\t|\v).*/);
// let res = str.match(/[^\s\b\n\f\r\t\v]+/);
// let res = str.match(/(\b).*/);
// console.info(res);

let x1 = {
    a: 1,
    b: 2,
};

let x2 = {
    c: 3,
}

console.info(x1, x2);

_.extend(x1, x2);

console.info(x1, x2);
