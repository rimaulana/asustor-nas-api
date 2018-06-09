const logger = require('./logger');
const mkdirp = require('mkdirp');

const cleanIPAddress = (ipAddress) => {
  const regex = new RegExp('\\:\\:.*\\:');
  if (regex.test(ipAddress)) {
    return ipAddress.replace(regex, '');
  }
  return ipAddress;
};

const cleanSourcePath = (source) => {
  if (source.endsWith('/')) {
    return source.slice(0, -1);
  }
  return source;
};

const getFileName = source => source.match(/(?:.*\/)?(.*)/)[1];

const genericReply = (res, error, data, code = 500) => {
  if (error) {
    res.status(code).json({ reason: error.message });
  } else {
    res.json(data);
  }
};

module.exports = {
  logger, cleanIPAddress, cleanSourcePath, getFileName, genericReply, mkdirp,
};
