var express = require("express"),
    router = express.Router(),
    logger = require("../utils/logger"),
    info = require("../package.json");

router.get("/", function(req, res) {
    var response = {
        process: "Health check",
        version: info.version,
        ok: true
    };
    logger.verbose(JSON.stringify(response));
    // return JSON HTTP response to API caller
    res.json(response);
});

router.post("/", function(req, res) {
    var response = {
        process: "Health check",
        version: info.version,
        ok: true
    };
    logger.verbose(JSON.stringify(response));
    // return JSON HTTP response to API caller
    res.json(response);
});

router.use(require("../middlewares/auth"));

router.use("/file", require("./file"));
router.use("/folder", require("./folder"));
router.use("/usb", require("./usb"));

router.use(function(req, res) {
    res.status(404).json({ reason: "not found" });
});

module.exports = router;
