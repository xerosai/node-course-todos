const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bCrypt = require('bcryptjs');

// const message = 'I am blah';
// const hashed = SHA256(message).toString();
//
// console.log(`Message: ${message}, Hash: ${hashed}`);
//
// const data = {
//     id: 4
// }
//
// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//     console.log('not changed');
// } else {
//     console.log('data changed');
// }

// const data = {id: 10};
//
// const token = jwt.sign(data, 'supersecret');
// console.log(token);
//
// const decoded = jwt.verify(token, 'supersecret');
// console.log('decoded', decoded);

var password = 'blah-blah-n@pe'

// bCrypt.genSalt(10, (error, salt) => {
//     bCrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPW = '$2a$10$zJ/KhAHwRguLKOWJMwdV0eAeerW.iIovYLiuXoNADgw5h/.BLT8VW';

bCrypt.compare(password, hashedPW, (err, res) => {
    console.log('Password matched:', res);
})
