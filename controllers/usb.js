var express = require("express"),
    router = express.Router(),
    utils = require("../utils"),
    asustor = require("@rimaulana/asustor-node"),
    fse = require("fs-extra");

router.get("/", function(req, res) {
    asustor.usbInfo(function(error, data) {
        if (error) {
            res.status(500).json({ reason: error.message });
        } else {
            res.json(data);
        }
    });
});

router.post("/:id", function(req, res) {
    if (req.body.source) {
        asustor.usbInfo(function(error, data) {
            if (error) {
                res.status(500).json({ reason: error.message });
            } else {
                var drive = null;
                for (var i = 0; i < data.drives.length; i++) {
                    if (parseInt(req.params.id) === data.drives[i].index) {
                        drive = data.drives[i];
                        break;
                    }
                }
                if (drive === null) {
                    res.status(500).json({ reason: "couldn't find drive you specified" });
                } else {
                    var src = utils.cleanSourcePath(req.body.source);
                    var dst = drive.name + "/" + utils.getFileName(src);
                    asustor.fileInfo(src, function(errs, dat) {
                        if (errs) {
                            res.status(500).json({ reason: errs.message });
                        } else {
                            if (dat.totalSize > drive.size) {
                                res.status(500).json({ reason: "destination drive doesn't have enough space" });
                            } else {
                                fse.copy(src, dst, err => {
                                    if (err) {
                                        utils.logger.error(err.message);
                                    } else {
                                        utils.logger.info("copied " + src + " to " + dst);
                                    }
                                });
                                res.json({ status: "operation success" });
                            }
                        }
                    });
                }
            }
        });
    } else {
        res.status(400).json({ reason: "source needs to be specified" });
    }
});

module.exports = router;
