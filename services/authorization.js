const jwt = null;
const refreshToken = {
    sign: (payload) => {
        const token = 'jsonwebtoken generated token';
        return token;
    },
    verify(req, res, next) {

        checkHeaders();

        jwt.verify(token[1], `secretKey☼"ç♂♦♣2B82☺54å☺2©Ë™♦4321QWEd32$@#$#@6^^!`, function (err, decoded) {
            if (err)
                res.status(401).send({ERR: `Token is not valid`});
            if (decoded) {
                req.token = decoded;
                next();
            }
        });
    }
};
const accessToken = {
    sign: (payload) => {
        const token = 'jsonwebtoken generated token';
        return token;
    },
    verify() {
        checkHeaders();
    }
};
const tempToken = {
    sign: (payload) => {
        const token = 'jsonwebtoken generated token';
        return token;
    },
    verify() {
        checkHeaders();

    }
};


const checkHeaders = () => {
    if (!req.headers[`authorization`])
        return res.status(401).send({ERR: `Authorization is required`});

    const header = req.headers[`authorization`];
    if (!header.startsWith('Bearer')) {
        return res.status(400).send({ERR: `Token is not in correct format`});
    }
    const token = header.split(' ');
    if (!token[1]) {
        return res.status(400).send({ERR: `Token is not in correct format`});
    }

};


module.exports = {
    refreshToken,
    accessToken,
    tempToken
};
