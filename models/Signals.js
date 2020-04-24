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
        ty: {
            // type
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        st: {
            // subType
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        tf: {
            // timeFreame
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        pa: {
            // pair
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        mti: {
            // masterTraderID
            type: String,
            required: true
        },
        s: {
            // signalStatus
            type: Boolean,
            default: true,
            required: true
        },
        mt: {
            // metaData
            type: Mixed,
            default: null
        }
    });
//validate unique records
schema.plugin(uniqueValidator);
schema.pre('save', async function (next) {
    next();
});

module.exports = schema;
