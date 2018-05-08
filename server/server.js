const express = require('express');
const bodyParser = require('body-parser');

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

const port = process.env.PORT || 3451;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

module.exports.app = app;
