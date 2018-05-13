const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');

const {Todo} = require('../../models/Todo');
const User = require('../../models/User');

module.exports.todos = [
     {_id: new ObjectID(), text: 'Example todo one', completed: false},
     {_id: new ObjectID(), text: 'Example todo two', completed: true, completedAt: Date.now()},
     {_id: new ObjectID(), text: 'Final todo three', completed: false}
];

module.exports.populateTodos = done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(this.todos);
    }).then(() => {
        done();
    }).catch(err => {
        done(err);
    });
};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

module.exports.users = [
    {
        _id: userOneId,
        email: 'blah@nope.com',
        password: 'userOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, 'supersecret').toString()
        }]
    }, {
        _id: userTwoId,
        email: 'jen@example.com',
        password: 'userTwoPass'
    }
];

module.exports.populateUsers = done => {
    User.remove({}).then(() => {
        const userOne = new User(this.users[0]).save();
        const userTwo = new User(this.users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
}
