const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    config = require('../config'),
    uniqueValidator = require('mongoose-unique-validator'),
    Mixed = mongoose.Schema.Types.Mixed,
    schema = new mongoose.Schema({
        cA: {
            // createdAt
            type: Date,
            default: Date.now
        },
        uA: {
            // updatedAt
            type: Date,
            default: Date.now
        },
        em: {
            // email
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        un: {
            // username
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        bn: {
            // baseName
            type: String,
            trim: true,
            default: null
        },
        pwd: {
            // password
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (value.length < 6) throw new Error('The Password length should be more than 6 chars');
            }
        },
        pn: {
            // phoneNumber
            type: Number,
            default: null
        },
        pm: {
            // permission
            type: String,
            default: 'U',
            required: true,
            validate(value) {
                //validate permission from defined list. this will reduce conflicts and security issues
                if (config["user-types"].indexOf(value) < 0) throw new Error('Undefined user type');
            }
        },
        tfa: {
            // boolean
            type: Boolean,
            default: false,
            required: true
        },

        tfs: {
            // tfa secret key
            type: String,
            required: true
        },
        st: {
            // status
            type: Boolean,
            default: true
        },
        mt: {
            // metaData
            type: Mixed,
            default: null
        }
    });
// validate unique records
schema.plugin(uniqueValidator);
schema.pre('save', async function (next) {
    if (this.isModified('pwd')) {
        // hashing the password
        this.pwd = await bcrypt.hash(this.pwd, 8);
    }
    next();
});

module.exports = schema;
