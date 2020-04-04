const fastify = require('fastify')({
        logger: true
    }),
    authService = require('./services/authorization'),
    Models = require('./models/__modelLoader');


//decorate fastify global variables
fastify.decorate('DB', Models);
fastify.decorate('AuthService', authService);


//register routes
fastify.register(require(`./routes/auth/authorize`));


//start api server
(async () => {
    try {
        await fastify.listen(1330)
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})();
