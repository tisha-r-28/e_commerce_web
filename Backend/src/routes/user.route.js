const express = require("express");
const validate = require("../middlewares/joi.validate");
const { signUp, login, changePassword } = require("../validations/user.joi.schema");
const userControllers = require("../controllers/user.controllers");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/registration", validate(signUp), userControllers.signUp);
router.post("/login", validate(login), userControllers.login);
router.post("/change-password", validate(changePassword), authentication, userControllers.changePassword);

module.exports = router;