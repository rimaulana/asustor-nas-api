var express = require("express"),
    router = express.Router(),
    logger = require("../utils/logger"),
    asustor = require("@rimaulana/asustor-node");

router.get("/:filename", function(req, res) {
    if (req.params.filename) {
        asustor.fileInfo(req.params.filename, function(error, data) {
            if (error) {
                res.status(500).json({ reason: error.message });
            } else {
                res.json(data);
            }
        });
    } else {
        res.status(400).json({ reason: "Filename needs to be specified" });
    }
});

module.exports = router;
