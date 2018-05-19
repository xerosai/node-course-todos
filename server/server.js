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

app.post('/todos', authenticate, async (req, res) => {

    try {
        const todo = await new Todo({
            text: req.body.text ? req.body.text.trim() : null,
            _creator: req.user._id
        }).save();

        res.send(todo);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/todos', authenticate, async (req, res) => {

    try {
        const todos = await Todo.find({_creator: req.user._id})

        res.send({todos});
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/todos/:id', authenticate, async (req, res) => {

    try {
        const todoId = req.params.id;

        if (!ObjectID.isValid(todoId)) {
            return res.status(404).send('Invalid ID');
        }

        const todo = await Todo.findOne({_id: todoId, _creator: req.user._id});

        if(!todo) {
            return res.status(404).send('Todo not found');
        }

        return res.send({todo});
    } catch (e) {
        res.status(400).send({message: 'An unspecified error occurred'});
    }

});

app.delete('/todos/:id', authenticate, async (req, res) => {

    try {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send('Todo not found');
        }

        const doc = await Todo.findOneAndRemove({_id: id, _creator: req.user._id});

        if (!doc) {
            return res.status(404).send({message: 'Todo not found'});
        }

        return res.status(200).send({todo: doc});
    } catch (e) {
        return res.status(400).send();
    }

});

app.patch('/todos/:id', authenticate, async (req, res) => {

    try {
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

        const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true});

        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    } catch (e) {
        return res.status(400).send();
    }

});

app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);

        const user = await new User(body).save();

        const token = user.generateAuthToken();

        res.header('x-auth', token).send(user);
    } catch (e) {
        return res.status(400).send(e);
    }
});


app.get('/users/me', authenticate, (req, res) => {

    res.send(req.user);
});

app.post('/users/login',  async (req, res) => {

    try {
        const body = _.pick(req.body, ['email', 'password']);

        const user = await User.findByCredentials(body.email, body.password);

        const token = await user.generateAuthToken();

        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }

});

app.delete('/users/me/token', authenticate, async (req, res) => {

    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

const port = process.env.PORT || 3451;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

module.exports.app = app;
