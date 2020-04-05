const mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	objId = mongoose.Types.ObjectId,
	Mixed = mongoose.Schema.Types.Mixed;
const schema = new mongoose.Schema({
	cA  : { type: Date, default: Date.now },
	uA  : { type: Date, default: Date.now },
	em  : { type: String, required: true, unique: true }, // email
	un  : {
		type     : String,
		required : true,
		unique   : true,
		trim     : true
	},
	bn  : {
		// base name
		type : String,
		trim : true
	},
	pwd : {
		//password
		type     : String,
		required : true,
		trim     : true,
		validate(value) {
			if (value.length < 6) throw new Error('The Password length should be more than 6 chars');
		}
	},
	pn  : {
		//phone number
		type : Number
	},
	pm  : {
		// permission
		type : String
	},
	tfa : {
		//boolean
		type    : Boolean,
		default : false
	},

	tfs : {
		// tfa secret key
		type   : String,
		unique : true
	},
	mt  : { type: Mixed }
});
//validate unique records
schema.plugin(uniqueValidator);
//set _id field before creating each record in database
schema.pre('save', function(next) {
	next();
});
module.exports = schema;
