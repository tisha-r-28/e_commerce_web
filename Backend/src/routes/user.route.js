const express = require("express");
const validate = require("../middlewares/joi.validate");
const { signUp, login } = require("../validations/user.joi.schema");
const userControllers = require("../controllers/user.controllers");
const router = express.Router();

router.post("/registration", validate(signUp), userControllers.signUp);
router.post("/login", validate(login), userControllers.login);

module.exports = router;