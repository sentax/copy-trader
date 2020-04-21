const bcrypt = require('bcryptjs');

async function authorizeRoute(fastify, options) {
    console.log('auth route');
    fastify.post(
        '/api/v1/auth/authorize',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        un: {
                            type: 'string'
                        },
                        pwd: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            const user = request.body;

            try {
                const foundUser = await fastify.DB['Users'].findOne({
                    $or: [
                        {em: user.em},
                        {un: user.un}
                    ]
                });

                if (!foundUser) {
                    const err = new Error();
                    err.statusCode = 500;
                    err.message = `User already exists`;
                    throw err;
                }

                if (!bcrypt.compareSync(user.pwd, foundUser.pwd)) {
                    return reply.status(401).send({error: 'Bad password'});
                }
                let output;
                const payload = {
                    em: foundUser.em,
                    un: foundUser.un,
                    _id: foundUser._id
                };
                if (foundUser.tfa) {
                    output = {
                        tempToken: fastify.AuthService.tempToken.sign(payload)
                    };
                } else {
                    output = {
                        accessToken: fastify.AuthService.accessToken.sign(payload),
                        refreshToken: await fastify.AuthService.refreshToken.sign(payload, fastify)
                    };
                }
                // console.log(output);
                return reply.status(200).send({
                    statusCode: 200,
                    ...output,
                    message: 'Authorized'
                });
            } catch (error) {
                reply.status(error.statusCode).send(error);
            }
        }
    );
}

module.exports = authorizeRoute;
