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
        vc: {
            // voucherCode
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        tp: {
            //type
            type: String,
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
        du: {
            // dueDate
            type: Date
        },
        uc: {
            // totalUsage
            type: Number
        },
        ai: {
            // adminID
            type: String,
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
