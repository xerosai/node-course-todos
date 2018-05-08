const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/Todo');
const {User} = require('../server/models/User');

const id = '5af1273d3ce80c1a568a424d';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}

Todo.find({
    _id: id
}).then(todos => {
    console.log('Todos', todos);
});

User.find({_id: '5aefd9335ccaaef700b23808'}).then(users => {
    console.log('Users', users);
}).catch(err => {
    console.log('Error getting users', users);
});

User.findById('5aefd9335ccaaef700b23808').then(user => {
    if (!user) {
        return console.log('Unable to find user');
    }
    console.log('User', user);
}).catch(err => {
    console.log('Error getting user', err);
});
