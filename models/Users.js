const mongoose = require('mongoose'), uniqueValidator = require('mongoose-unique-validator'),
    objId = mongoose.Types.ObjectId, Mixed = mongoose.Schema.Types.Mixed;
const schema = new mongoose.Schema(
    {
        _id: {type: String},
        cA: {type: Date, default: Date.now},
        uA: {type: Date, default: Date.now},
        email: {type: String, required: true, unique: true},

        meta: {type: Mixed}
    }
);
//validate unique records
schema.plugin(uniqueValidator);
//set _id field before creating each record in database
schema.pre('save', function (next) {
    this._id = new objId();
    next()
})
module.exports = schema;