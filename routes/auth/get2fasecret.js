const { authenticator } = require('otplib');

async function get2fasecret(fastify, options) {
	console.log('get2fa secret route');
	fastify.put('/api/v1/auth/get2fa_secret', async (request, reply) => {
		try {
			await fastify.AuthService.accessToken.verify(request, reply);
			const foundUser = await fastify.DB['Users'].findOne({
				em : request.token.em
			});
			await fastify.DB['Users'].findByIdAndUpdate(foundUser._id, {
				tfs : authenticator.generateSecret(),
				uA  : Date.now()
			});
			const updatedUser = await fastify.DB['Users'].findOne({
				em : request.token.em
			});
			let output = { message: 'new secret generated' };
			if (!foundUser.tfa) {
				output.secret = updatedUser.tfs;
			}
			reply.status(200).send(output);
		} catch (error) {
			reply.status(400).send(error);
		}
	});
}

module.exports = get2fasecret;
