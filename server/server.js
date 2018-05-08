const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');

const app = express();

app.use(bodyParser.json({
    limit: '1024kb'
}));

app.post('/todos', (req, res) => {

    const todo = new Todo({
        text: req.body.text ? req.body.text.trim() : null,
    });

    todo.save().then(doc => {
        res.send(doc);
    }).catch(err => {
        console.log(`Failed to save todo with error: ${err}`);
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({todos});
    }).catch(err => {
        console.log(`Failed to fetch todos with error: ${err}`);
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    const todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send('Invalid ID');
    }

    Todo.findById(todoId).then(todo => {
        if(!todo) {
            return res.status(404).send('Todo not found');
        }

        return res.send({todo});
    }).catch(err => {
        res.status(400).send({message: 'An unspecified error occurred'});
    });
})

const port = process.env.PORT || 3451;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

module.exports.app = app;
