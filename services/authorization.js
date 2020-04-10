/*
* Primary file for generate and verify Tokens
*
 */

// Dependencies
const jwt = require('jsonwebtoken');

// Private key define
const privateKey = '4tet#Ebb&CW&h4bwK+9a#fm!';

// Access token generate and verify function
const accessToken = {
	sign   : (payload) => {
		return jwt.sign(
			{
				...payload
			},
			privateKey,
			{ expiresIn: 4 * (60 * 60) }
		); // Expires in 4h
	},
	verify(req, res, next) {
		// Check token Correctivity
		const token = checkHeaders(req, res);
		jwt.verify(token, privateKey, function(err, decoded) {
			if (err) return res.status(401).send({ ERR: `Token is not valid` });
			if (decoded) {
				req.token = decoded;
				next();
			}
		});
	}
};

// Temp token generate and verify function
const tempToken = {
	sign   : (payload) => {
		return jwt.sign(
			{
				...payload
			},
			privateKey,
			{ expiresIn: 1 * (60 * 60) }
		); // Expires in 1h
	},
	verify(req, res, next) {
		// Check token Correctivity
		console.log(req.headers);
		const token = checkHeaders(req, res);
		jwt.verify(token, privateKey, function(err, decoded) {
			if (err) return res.status(401).send({ ERR: `Token is not valid` });
			if (decoded) {
				req.token = decoded;
				// next();
			}
		});
	}
};

// Refresh token generate and verify function
const refreshToken = {
	sign   : async (payload, fastify) => {
		let key = `REF:${payload._id}`;
		// const tries = await syncRedisGet(fastify, key);
		const token = jwt.sign(
			{
				...payload
			},
			privateKey,
			{ expiresIn: 24 * (60 * 60) * 30 } // Expires in 1M
		);
		await fastify.Redis.set(key, token, 'EX', 24 * (60 * 60) * 30); //Expires in 1M

		return await token;
	},

	verify(req, res, next) {
		// Check token Correctivity
		const token = checkHeaders(req, res);
		jwt.verify(token, privateKey, function(err, decoded) {
			if (err) return res.status(401).send({ ERR: `Token is not valid` });
			if (decoded) {
				req.token = decoded;
				next();
			}
		});
	}
};

// Check correct header function
const checkHeaders = (req, res) => {
	// Check authorization header found
	if (!req.headers['authorization']) return res.status(401).send({ ERR: `Authorization is required` });

	// Check if header start with Bearer
	const header = req.headers['authorization'];
	if (!header.startsWith('Bearer')) return res.status(400).send({ ERR: `Token is not in correct format` });

	// Check if token is !null
	const token = header.split(' ');
	if (!token[1]) return res.status(400).send({ ERR: `Token is not in correct format` });
	else return token[1];
};

// Check Token Exists
const syncRedisGet = async (fastify, key) => {
	return new Promise((resolve, reject) => {
		fastify.Redis.get(key, async (err, val) => {
			if (err) {
				reject(err);
			}
			resolve(val);
		});
	});
};

// Export modules
module.exports = {
	accessToken,
	tempToken,
	refreshToken
};
