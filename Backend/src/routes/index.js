const express = require("express");
const router = express.Router();

router.use("/user", require("./user.route"));
router.use("/product", require("./product.route"));

module.exports = router;