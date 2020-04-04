async function indexRoute(fastify, options) {
    fastify.get('/api/v1/auth/authorize', async (request, reply) => {
        const token = fastify.AuthService.accessToken.sign({}); // auth servuce usage example
        console.log(token);
        const User = await fastify.DB['Users'].findOne({}); // Database model usage example ( await is required )
        console.log(User);//null
        return {API: 'S3NTAX, Welcome to API V1.0.0 ;)'}
    })
}

module.exports = indexRoute;
