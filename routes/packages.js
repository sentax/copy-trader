async function indexRoute(fastify) {
    fastify.get('/api/v1/auth/authorize', {
        preHandler: [fastify.AuthService.accessToken.verify]
    }, async (request, reply) => {

        return {API: 'S3NTAX, Welcome to API V1.0.0 ;)'}
    })
}

module.exports = indexRoute;
