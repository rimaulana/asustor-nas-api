const winston = require('winston');
const slack = require('winston-slack-transport');
const mkdirp = require('mkdirp');
const config = require('../config');
require('winston-daily-rotate-file');

// configure required directory for logging and accessing external script
const rootFolder = require('path').dirname(require.main.filename);

const pathConnector = /^win/.test(process.platform) ? '\\' : '/';
const logPath = rootFolder + ['', 'logs', ''].join(pathConnector);

// define the datetime format for winston logger
const tsFormat = () => {
  const dateTime = new Date();
  const dt = dateTime.toISOString().split('T')[0];
  const tm = dateTime.toISOString().split('T')[1].split('.')[0];
  return `${dt} ${tm}`;
};

// define log format that will be sent by winston logger to slack
// output example [*2017-11-01 16:50:13*][*DEBUG*] Debugging info
const slackLogFormatter = (level, msg) => {
  const message = `[*${tsFormat()}*][*${level.toUpperCase()}*] ${msg}`;
  return {
    text: message,
  };
};

// define log format that will be sent by winston logger to console and log file
// output example [2017-11-01 16:50:13][DEBUG] Debugging info
const myLogFormatter = (options) => {
  const msg = options.message || '';
  let meta = '';
  if (options.meta && Object.keys(options.meta).length) {
    meta = `\n\t${JSON.stringify(options.meta)}`;
  }
  const formatted = `[${options.timestamp()}][${options.level.toUpperCase()}] ${msg}${meta}`;
  if (options.colorize) {
    return winston.config.colorize(options.level, formatted);
  }
  return formatted;
};

// create log folder if not exist
mkdirp.sync(logPath);

// define winston logger transport as for this definition we have three destination
//  - console
//  - log file
//  - slack channel
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
      formatter: myLogFormatter,
      level: 'verbose',
    }),
    new winston.transports.DailyRotateFile({
      timestamp: tsFormat,
      json: false,
      formatter: myLogFormatter,
      dirname: logPath,
      filename: '.log',
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: 'silly',
    }),
  ],
});
if (config.slack_webhook) {
  logger.add(slack, {
    webhook_url: config.slack_webhook,
    handleExceptions: true,
    custom_formatter: slackLogFormatter,
    level: 'info',
  });
}

module.exports = logger;
