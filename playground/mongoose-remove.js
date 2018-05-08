const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/Todo');
const {User} = require('../server/models/User');

// Todo.remove({}).then(result => {
//
// }).catch(err => {
//     console.log('Failed to remove todos', err);
// });

// Todo.findOneAndRemove({_id: '5af1a6fbb0b12427dfb61ea7'}).then(todo => {
//     console.log('Todo removed', todo);
// }).catch(err => {
//     console.log('Failed to remove todo', err);
// });

Todo.findByIdAndRemove('5af1a6fbb0b12427dfb61ea7').then(todo => {
    console.log('Todo removed', todo);
}).catch(err => {
    console.log('Failed to remove todo', err);
});
