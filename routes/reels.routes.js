const router = require("express").Router();
const reelscontroller = require("../controllers/reelsController");

router.get("/views", reelscontroller.reelsCountFunction);

module.exports = router;