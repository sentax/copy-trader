const refreshToken = {
    sign: (payload) => {
        const token = 'jsonwebtoken generated token';
        return token;
    },
    verify() {

    }
};
const accessToken = {
    sign: (payload) => {
        const token = 'jsonwebtoken generated token';
        return token;
    },
    verify() {

    }
};
const tempToken = {
    sign: (payload) => {
        const token = 'jsonwebtoken generated token';
        return token;
    },
    verify() {

    }
};


module.exports = {
    refreshToken,
    accessToken,
    tempToken
};
