let { authenticator } = require('@otplib/preset-default');

async function verify2fa(fastify, options) {
	console.log('auth route');
	fastify.post(
		'/api/v1/auth/verify2fa',
		{
			schema : {
				body : {
					type       : 'object',
					properties : {
						un  : {
							type : 'string'
						},
						pwd : {
							type : 'string'
						}
					}
				}
			}
		},
		async (request, reply, next) => {
			const user = request.body;
			try {
				fastify.AuthService.tempToken.verify(request, reply, next);
				const foundUser = await fastify.DB['Users'].findOne({
					em : request.token.em
				});
				if (!(foundUser && foundUser._id)) {
					const err = new Error();
					err.statusCode = 500;
					err.message = `User not found`;
					throw err;
				}
				const payload = {
					em  : foundUser.em,
					un  : foundUser.un,
					_id : foundUser._id
				};
				const verifiedCode = authenticator.verify({ token: user.code, secret: foundUser.tfs });
				console.log(verifiedCode);
				if (!verifiedCode) {
					const err = new Error();
					err.statusCode = 401;
					err.message = `Code is not correct.`;
					throw err;
				}

				reply.send({
					statusCode   : 200,
					accessToken  : fastify.AuthService.accessToken.sign(payload),
					refreshToken : await fastify.AuthService.refreshToken.sign(payload, fastify)
				});
			} catch (error) {
				reply.status(401).send(error);
			}
			// console.log(request.headers);
		}
	);
}

module.exports = verify2fa;
