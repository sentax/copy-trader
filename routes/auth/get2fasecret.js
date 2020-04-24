const { authenticator } = require('otplib');

async function get2fasecret(fastify, options) {
	console.log('get2fa secret route');
	fastify.put(
		'/api/v1/auth/get2fa_secret',
		{
			schema : {
				response : {
					200 : {
						type       : 'object',
						properties : {
							statusCode : { type: 'number' },
							message    : { type: 'string' },
							secret     : { type: 'string' }
						}
					},
					400 : {
						type       : 'object',
						properties : {
							statusCode : { type: 'number' },
							error      : { type: 'string' },
							message    : { type: 'string' }
						}
					}
				}
			}
		},
		async (request, reply) => {
			const user = request.body;

			try {
				await fastify.AuthService.accessToken.verify(request, reply);
				const foundUser = await fastify.DB['Users'].findOne({
					em : request.token.em
				});
				if (!(foundUser && foundUser._id)) {
					const err = new Error();
					err.statusCode = 500;
					err.message = `Unable to find User`;
					throw err;
				}
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
				return reply.status(200).send({ statusCode: reply.statusCode, ...output });
			} catch (error) {
				reply.status(error.statusCode).send(error);
			}
		}
	);
}

module.exports = get2fasecret;
