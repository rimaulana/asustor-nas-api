const express = require('express');
const utils = require('../utils');
const config = require('../config');

const router = express.Router();

router.use((req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token;
  if (token) {
    if (config.api_keys.indexOf(token) !== -1) {
      next();
    } else {
      utils.logger.warn(`${utils.cleanIPAddress(req.ip)} - called ${req.url} with invalid access key`);
      res.status(401).json({ reason: 'access token invalid' });
    }
  } else {
    utils.logger.warn(`${utils.cleanIPAddress(req.ip)} - called ${req.url} without access key`);
    res.status(401).json({ reason: 'access token required' });
  }
});

module.exports = router;
