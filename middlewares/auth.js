const express = require('express');
const utils = require('../utils');
const config = require('../config');

const router = express.Router();

const warning = (req, res, fault) => {
  const message = (fault === 'invalid' ? 'with invalid' : 'without');
  utils.logger.warn(`${utils.cleanIPAddress(req.ip)} - called ${req.url} ${message} access key`);
  res.status(401).json({ reason: `access token ${fault}` });
};

router.use((req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token || null;
  const fault = (token === null ? 'required' : 'invalid');
  if (fault !== 'required' && config.api_keys.indexOf(token) !== -1) {
    next();
  } else {
    warning(req, res, fault);
  }
});

module.exports = router;
