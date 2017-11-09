const winston = require("winston"),
    slack = require("winston-slack-transport"),
    fs = require("fs"),
    moment = require("moment"),
    mkdirp = require("mkdirp"),
    config = require("../config");
require("winston-daily-rotate-file");

// configure required directory for logging and accessing external script
const root_folder = require("path").dirname(require.main.filename);
const path_connector = /^win/.test(process.platform) ? "\\" : "/";
const nodejs_log_path = root_folder + ["", "logs", ""].join(path_connector);

// define the datetime format for winston logger
const tsFormat = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
};

// define log format that will be sent by winston logger to slack
// output example [*2017-11-01 16:50:13*][*DEBUG*] Debugging info
var slackLogFormatter = function(level, msg, meta) {
    var message = "[*" + tsFormat() + "*][*" + level.toUpperCase() + "*] " + msg;
    return {
        text: message
    };
};

// define log format that will be sent by winston logger to console and log file
// output example [2017-11-01 16:50:13][DEBUG] Debugging info
var myLogFormatter = function(options) {
    var formatted = "[" + options.timestamp() + "][" + options.level.toUpperCase() + "] " + (options.message ? options.message : "") + (options.meta && Object.keys(options.meta).length ? "\n\t" + JSON.stringify(options.meta) : "");
    return options.colorize ? winston.config.colorize(options.level, formatted) : formatted;
};

// create log folder if not exist
mkdirp.sync(nodejs_log_path);

// define winston logger transport as for this definition we have three destination
//  - console
//  - log file
//  - slack channel
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: tsFormat,
            colorize: true,
            formatter: myLogFormatter,
            level: "verbose"
        }),
        new winston.transports.DailyRotateFile({
            timestamp: tsFormat,
            json: false,
            formatter: myLogFormatter,
            dirname: nodejs_log_path,
            filename: ".log",
            datePattern: "yyyy-MM-dd",
            prepend: true,
            level: "silly"
        })
    ]
});
if (config.slack_webhook) {
    logger.add(slack, {
        webhook_url: config.slack_webhook,
        handleExceptions: true,
        custom_formatter: slackLogFormatter,
        level: "info"
    });
}

module.exports = logger;
