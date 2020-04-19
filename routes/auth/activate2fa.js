let { authenticator } = require('@otplib/preset-default');
const bcrypt = require('bcryptjs');

async function activate2fa(fastify, options) {
	console.log('auth route');
	fastify.put(
		'/api/v1/auth/activate2fa',
		{
			schema : {
				body : {
					type       : 'object',
					properties : {
						code : {
							type : 'string'
						},
						pwd  : {
							type : 'string'
						}
					}
				}
			}
		},
		async (request, reply, next) => {
			await fastify.AuthService.accessToken.verify(request, reply);
			const user = request.body;

			try {
				const foundUser = await fastify.DB['Users'].findOne({
					em : request.token.em
				});
				if (foundUser.tfa) reply.status(401).send({ error: 'users tfa was enabled before' });
				if (!bcrypt.compareSync(user.pwd, foundUser.pwd)) {
					return reply.status(401).send({ error: 'Bad password' });
				}
				const verifiedCode = authenticator.verify({ token: user.code, secret: foundUser.tfs });
				if (!verifiedCode) {
					return reply.status(401).send({
						statusCode : 401,

						message    : 'The Code is not correct.'
					});
				}
				await fastify.DB['Users'].findByIdAndUpdate(foundUser._id, {
					tfa : true,
					uA  : Date.now()
				});

				reply.status(200).send({ message: "user's tfa enabled now. " });
			} catch (error) {
				reply.status(401).send(error);
			}
			// console.log(request.headers);
		}
	);
}

module.exports = activate2fa;
