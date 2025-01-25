const router = require('express').Router();
const loginController = require("../controllers/loginController");

router.post("/logn", loginController.loginFunnction)

module.exports = router;