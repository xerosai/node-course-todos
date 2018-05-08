const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: {
        minLength: 1,
        required: true,
        trim: true,
        type: String
    }
});

module.exports.User = User;
