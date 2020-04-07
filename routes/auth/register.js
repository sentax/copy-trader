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
			const user = request.body;
			let token;
			try {
				await fastify.DB['Users']
					.create({
						un  : user.un,
						em  : user.em,
						pwd : user.pwd,
						pn  : user.pn,
						bn  : user.bn
					})
					.then((user) => {
						console.log(user);
						token = fastify.AuthService.accessToken.sign({
							em  : user.em,
							un  : user.un,
							_id : user._id
						});
					});

				return reply.status(200).send({
					statusCode : reply.statusCode,
					message    : 'Saved Successfully',
					token      : token
				});
			} catch (error) {
				reply.status(400).send(error);
			}
		}
	);
}
module.exports = registerRoute;
