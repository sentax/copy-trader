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
        am: {
            // purchaseAmount
            type: Number,
            required: true
        },
        em: {
            // emailAddress
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        vc: {
            // voucherCode
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
        },
        st: {
            // status
            type: Boolean,
            default: false,
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
