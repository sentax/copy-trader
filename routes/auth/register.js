async function registerRoute(fastify, options) {
	console.log('auth route');
	fastify.post(
		'/api/v1/auth/register',
		{
			schema : {
				response : {
					200 : {
						type       : 'object',
						properties : {
							statusCode : { type: 'number' },
							message    : { type: 'string' },
							token      : { type: 'string' },
							user       : { type: 'object' }
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
			// const user = request.body;
			let token;
			try {
				await fastify.DB['Users'].create(request.body).then((user) => {
					console.log(user);
					token = fastify.AuthService.accessToken.sign({
						em : user.em,
						un : user.un
					});
				});

				reply.statusCode = 200;
				reply.send({
					statusCode : reply.statusCode,
					message    : 'Saved Successfully',
					token      : token
				});
			} catch (error) {
				reply.statusCode = 400;
				console.log(error);
				reply.send(error);
			}
		}
	);
}
module.exports = registerRoute;
