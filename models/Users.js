const mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
	{ authenticator } = require('otplib'),
	uniqueValidator = require('mongoose-unique-validator'),
	Mixed = mongoose.Schema.Types.Mixed;
const schema = new mongoose.Schema({
	cA  : { type: Date, default: Date.now },
	uA  : { type: Date, default: Date.now },
	em  : { type: String, required: true, unique: true, lowercase: true }, // email
	un  : {
		type      : String,
		required  : true,
		unique    : true,
		trim      : true,
		lowercase : true
	},
	bn  : {
		// base name
		type    : String,
		trim    : true,
		default : null
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
		type    : Number,
		default : null
	},
	pm  : {
		// permission
		type    : String,
		default : 'U'
	},
	tfa : {
		//boolean
		type    : Boolean,
		default : false
	},

	tfs : {
		// tfa secret key
		type    : String,
		default : authenticator.generateSecret()
	},
	st  : { type: Boolean, default: true },
	mt  : { type: Mixed, default: null }
});
//validate unique records
schema.plugin(uniqueValidator);
schema.pre('save', async function(next) {
	if (this.isModified('pwd')) {
		// hashing the password

		this.pwd = await bcrypt.hash(this.pwd, 8);
	}
	next();
});

module.exports = schema;
