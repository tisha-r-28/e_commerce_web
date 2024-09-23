const logger = require("../config/logger");
const apiResponse = require("../utils/api.response");
const message = require("../json/messages.json");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return apiResponse.UNAUTHORIZED({
            res,
            message: message.unauthorized
        });
    }

    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        console.log(decoded.user.id)
        const user = await User.findById(decoded.user.id);
        
        if (!user) {
            return apiResponse.UNAUTHORIZED({
                res,
                message: message.user_not_found
            });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error(`Internal server error for authentication: ${error.message}`);
        return apiResponse.CATCH_ERROR({
            res,
            message: `${error.message} | ${message.something_went_wrong}`
        });
    }
};
