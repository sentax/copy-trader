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
        co: {
            // usageCount
            type: Number
        },
        pr: {
            // price
            type: Number
        },
        nm: {
            // name
            type: String,
            required: true,
            lowercase: true
        },
        ty: {
            // type
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        ex: {
            // exchange
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
        st: {
            // status
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
