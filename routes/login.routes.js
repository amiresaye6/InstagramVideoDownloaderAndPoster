const router = require('express').Router();
const loginController = require("../controllers/loginController");

router.post("/", loginController.loginFunction)

module.exports = router;