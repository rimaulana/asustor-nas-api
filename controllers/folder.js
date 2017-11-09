var express = require("express"),
    router = express.Router(),
    mkdirp = require("mkdirp"),
    logger = require("../utils/logger"),
    asustor = require("@rimaulana/asustor-node");

router.get("/:foldername", function(req, res) {
    asustor.folderInfo(req.params.foldername, function(error, data) {
        if (error) {
            res.status(500).json({ reason: error.message });
        } else {
            res.json(data);
        }
    });
});

router.post("/:foldername", createFolder);
router.post("/", createFolder);

function createFolder(req, res) {
    var folderName = req.params.foldername || req.body.foldername;
    if (folderName) {
        folderName = folderName.endsWith("/") ? folderName.slice(0, -1) : folderName;
        mkdirp(folderName, function(error) {
            if (error) {
                res.status(500).json({ reason: error.message });
            } else {
                res.json({ status: "folder " + folderName + " created" });
            }
        });
    } else {
        res.status(400).json({ reason: "foldername needs to be specified" });
    }
}
module.exports = router;
