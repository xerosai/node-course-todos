const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
    text: {
        minLength: 1,
        required: true,
        trim: true,
        type: String
    },
    completed: {
        default: false,
        type: Boolean
    },
    completedAt: {
        default: null,
        type: Date
    },
    _creator: {
        ref: 'User',
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports.Todo = Todo;
