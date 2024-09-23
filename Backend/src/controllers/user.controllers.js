const logger = require("../config/logger");
const apiResponse = require("../utils/api.response");
const message = require("../json/messages.json");
const User = require("../models/user.model");
const { hashPassword, comparePassword, generateToken } = require("../utils/utils");

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
            };

            if (password !== confirmPassword) {
                return apiResponse.BAD_REQUEST({
                    res,
                    message: message.passwords_do_not_match
                });
            };

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
            };

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
    
    //login route controller
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const existEmail = await User.findOne({ email, deletedAt: null });
    
            if (!existEmail) {
                return apiResponse.UNAUTHORIZED({
                    res,
                    message: message.email_not_register,
                });
            }
    
            const isPasswordMatch = await comparePassword({ password, hash: existEmail.password });
            if (!isPasswordMatch) {
                return apiResponse.UNAUTHORIZED({
                    res,
                    message: message.invalid_password,
                });
            }
    
            const token = await generateToken({ user: { id: existEmail._id } });
    
            return apiResponse.OK({
                res,
                message: message.login_successful,
                data: {
                    user: {
                        fname: existEmail.fname,
                        lname: existEmail.lname,
                        email: existEmail.email
                    },
                    token: token
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

    //changepassword route controller
    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const existUser = await User.findById(req.user.id);
            if(!existUser){
                return apiResponse.FORBIDDEN({
                    res,
                    message: message.invalid_token
                })
            };
            const isPasswordMatch = await comparePassword({ password: oldPassword, hash: existUser.password });
            if(!isPasswordMatch){
                return apiResponse.NOT_FOUND({
                    res,
                    message: message.old_password_wrong
                })
            }
            const hashedPassword = await hashPassword({ password: newPassword });
            const updatedPassword = await User.findByIdAndUpdate(existUser._id, { $set : { password: hashedPassword } }, { new: true });
            if(!updatedPassword){
                return apiResponse.CONFLICT({
                    res, 
                    message: message.conflict
                })
            }
            return apiResponse.OK({
                res,
                message: message.updated,
                data: {
                    updatedPassword
                }
            })
        } catch (error) {
            logger.error(`Internal server error: ${error.message}`);
            return apiResponse.CATCH_ERROR({
                res,
                message: `${message.something_went_wrong} | ${error.message}`
            });
        }
    }
}