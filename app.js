var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    port = process.env.PORT || 3000;
var logger = require("./utils/logger");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("./controllers"));

app.listen(port, function() {
    logger.verbose("Running server on port " + port);
});
