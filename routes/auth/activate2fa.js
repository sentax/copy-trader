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
				if (!(foundUser && foundUser._id)) {
					const err = new Error();
					err.statusCode = 500;
					err.message = `Unable to create User`;
					throw err;
				}
				if (foundUser.tfa) {
					const err = new Error();
					err.statusCode = 401;
					err.message = `users tfa was enabled before`;
					throw err;
				}
				const verifiedCode = authenticator.verify({ token: user.code, secret: foundUser.tfs });

				if (!bcrypt.compareSync(user.pwd, foundUser.pwd) || !verifiedCode) {
					const err = new Error();
					err.statusCode = 401;
					err.message = `wrong password or wrong code`;
					throw err;
				}

				await fastify.DB['Users'].findByIdAndUpdate(foundUser._id, {
					tfa : true,
					uA  : Date.now()
				});

				reply.status(200).send({ statusCode: reply.statusCode, message: "user's tfa enabled now. " });
			} catch (error) {
				reply.status(error.statusCode).send(error);
			}
			// console.log(request.headers);
		}
	);
}

module.exports = activate2fa;
