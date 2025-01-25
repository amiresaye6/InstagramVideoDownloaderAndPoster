const router = require("express").Router();
const reelscontroller = require("../controllers/reelsController");

router.get("/views", reelscontroller.reelsCountFunction);
router.get("/urls", reelscontroller.getReelsUrls);
router.post("/", reelscontroller.postReel);

module.exports = router;