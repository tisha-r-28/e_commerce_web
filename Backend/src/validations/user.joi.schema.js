const Joi = require("joi");

const signUp = {
    body: Joi.object().keys({
        fname: Joi.string().required(),
        lname: Joi.string().required(),
        role: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(10).required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
        phoneNo: Joi.string().min(10).required()
    }).with('password', 'confirmPassword') // Ensure password and confirmPassword are validated together
}

const login = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(10).required()
    })
}

module.exports = {
    signUp,
    login
}
