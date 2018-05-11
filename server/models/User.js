const _ = require('lodash');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const validator = require('validator');

const UserSchema = new Schema({
    email: {
        minLength: 1,
        required: true,
        trim: true,
        type: String,
        unique: true,
        validate: {
            validator: value => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        minLength: 6,
        required: true,
        type: String
    },
    tokens: [{
        access: {
            required: true,
            type: String
        },
        token: {
            required: true,
            type: String
        }
    }]
})

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    console.log('instance method - generateAuthToken');
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'supersecret').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

module.exports = mongoose.model('User', UserSchema);
