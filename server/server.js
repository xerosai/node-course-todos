require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const User = require('./models/User');
const {authenticate} = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json({
    limit: '1024kb'
}));

app.post('/todos', authenticate, (req, res) => {

    const todo = new Todo({
        text: req.body.text ? req.body.text.trim() : null,
        _creator: req.user._id
    });

    todo.save().then(doc => {
        res.send(doc);
    }).catch(err => {
        console.log(`Failed to save todo with error: ${err}`);
        res.status(400).send(err);
    })
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then(todos => {
        res.send({todos});
    }).catch(err => {
        console.log(`Failed to fetch todos with error: ${err}`);
        res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    const todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send('Invalid ID');
    }

    Todo.findOne({_id: todoId, _creator: req.user._id}).then(todo => {
        if(!todo) {
            return res.status(404).send('Todo not found');
        }

        return res.send({todo});
    }).catch(err => {
        res.status(400).send({message: 'An unspecified error occurred'});
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo not found');
    }

    Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then(doc => {
        if (!doc) {
            return res.status(404).send({message: 'Todo not found'});
        }

        return res.status(200).send({todo: doc});
    }).catch(err => {
        return res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo not found');
    }

    const body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = Date.now();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(err => {
        return res.status(400).send();
    })
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save().then(() => {
        // res.send(doc);
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(err => {
        return res.status(400).send(err);
    });
});


app.get('/users/me', authenticate, (req, res) => {

    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then(user => {

        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(error => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((err) => {
        res.status(400).send();
    });
});

const port = process.env.PORT || 3451;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

module.exports.app = app;
