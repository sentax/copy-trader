const mongoose = require('mongoose'),
	db = mongoose.connection,
	fs = require('fs'),
	path = require('path');

db.on('error', console.error.bind(console, 'connection error:'));
// console.log(mongoose.connection.on('error',() ));

mongoose.set('useFindAndModify', false);

//mongodb connection
mongoose.connect(`mongodb://127.0.0.1:27017/cpytrade_dev`, {
	useCreateIndex     : true,
	useNewUrlParser    : true,
	useUnifiedTopology : true
});

//Load all models in models folder
let models = {};
fs.readdirSync(path.join(__dirname)).forEach((modelName) => {
	if (modelName !== '__modelLoader.js') {
		let splitedName = modelName.split('.');
		const modelFile = require(path.join(__dirname, modelName));
		models[splitedName[0]] = mongoose.model(splitedName[0], modelFile);
	}
});
console.log(__dirname);
module.exports = models;
