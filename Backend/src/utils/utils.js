const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = {
    hashPassword: async ({ password }) => {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    },

    generateToken: (payload) => {
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn : process.env.JWT_ACCESS_EXPIRATION}
        );
        return token;
    },

    decodeToken: ({ token }) => {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    },

    comparePassword: async ({ password, hash }) => {
        const isPasswordMatch = await bcrypt.compare(password, hash);
        return isPasswordMatch;
    },
};