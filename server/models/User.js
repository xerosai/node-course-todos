const _ = require('lodash');
const bCrypt = require('bcryptjs');
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

UserSchema.methods.removeToken = function (token) {
    const user = this;
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
}

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded = undefined;

    try {
        decoded = jwt.verify(token, 'supersecret');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({email}).then(user => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bCrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    return reject(err);
                }

                if (!res) {
                    return reject();
                }

                return resolve(user);
            });
        });
    })
}

UserSchema.pre('save', function(next) {

    const user = this;

    if (user.isModified('password')) {

        bCrypt.genSalt(10, (error, salt) => {
            bCrypt.hash(user.password, salt, (err, hashed) => {
                user.password = hashed;
                next();
            });
        });

    } else {
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);
