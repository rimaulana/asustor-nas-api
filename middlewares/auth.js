var express = require("express"),
    router = express.Router(),
    utils = require("../utils"),
    config = require("../config");

router.use(function(req, res, next) {
    const token = req.headers["x-access-token"] || req.query.token || req.body.token;
    if (token) {
        if (config.api_keys.indexOf(token) !== -1) {
            next();
        } else {
            utils.logger.warn(utils.cleanIPAddress(req.ip) + " - called " + req.url + " with invalid access key");
            res.status(403).json({ reason: "access token invalid" });
        }
    } else {
        utils.logger.warn(utils.cleanIPAddress(req.ip) + " - called " + req.url + " without access key");
        res.status(403).json({ reason: "access token required" });
    }
});

module.exports = router;
