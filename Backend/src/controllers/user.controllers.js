const logger = require("../config/logger");
const apiResponse = require("../utils/api.response");
const message = require("../json/messages.json");
const User = require("../models/user.model");
const { hashPassword } = require("../utils/utils");

module.exports = {
    //signup rout controller
    signUp: async (req, res) => {
        try {
            const { fname, lname, email, password, confirmPassword, role, phoneNo } = req.body;
            
            const existEmail = await User.findOne({ email, deletedAt: null });
            if (existEmail) {
                return apiResponse.CONFLICT({
                    res,
                    message: message.email_already_taken
                });
            }

            if (password !== confirmPassword) {
                return apiResponse.BAD_REQUEST({
                    res,
                    message: message.passwords_do_not_match
                });
            }

            const hashedPassword = await hashPassword({ password });

            const user = await User.create({
                fname,
                lname,
                email,
                role,
                phoneNo,
                password: hashedPassword
            });

            if (!user) {
                return apiResponse.CATCH_ERROR({
                    res,
                    message: message.user_creation_failed
                });
            }

            return apiResponse.OK({
                res,
                message: message.created,
                data: {
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    phone_number: user.phoneNo,
                    status: user.role
                }
            });

        } catch (error) {
            logger.error(`Internal server error: ${error.message}`);
            return apiResponse.CATCH_ERROR({
                res,
                message: message.something_went_wrong
            });
        }
    },
}