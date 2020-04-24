const fastify = require('fastify')({
        logger: true
    }),
    authService = require('./services/authorization'),
    fs = require('fs'),
    path = require('path'),
    Models = require('./models/__modelLoader'),
    redis = require('redis');

//decorate fastify global variables
fastify.decorate('DB', Models);
fastify.decorate('Redis', redis.createClient());

fastify.decorate('AuthService', authService);

//register routes
// fastify.register(require(`./routes/auth/authorize`));
// fastify.register(require(`./routes/auth/register`));

getFilesFromDir(path.resolve(__dirname, 'routes'), [
    '.js'
]).map((file) => {
    fastify.register(require(`./routes/${file}`));
});

//just copied from stackoverflow.com dont trust this fucking code
function getFilesFromDir(dir, fileTypes) {
    var filesToReturn = [];

    function walkDir(currentPath) {
        var files = fs.readdirSync(currentPath);
        for (var i in files) {
            var curFile = path.join(currentPath, files[i]);
            if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
                filesToReturn.push(curFile.replace(dir, ''));
            } else if (fs.statSync(curFile).isDirectory()) {
                walkDir(curFile);
            }
        }
    }

    walkDir(dir);
    return filesToReturn;
}

//start api server
(async () => {
    try {
        await fastify.listen(1330);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})();
