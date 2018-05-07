const express = require('express');
const utils = require('../utils');
const info = require('../package.json');

const router = express.Router();

const healthCheck = (req, res) => {
  const response = {
    process: 'Health check',
    version: info.version,
    ok: true,
  };
  utils.genericReply(res, null, response);
};

const notFound = (req, res) => {
  utils.genericReply(res, new Error('resource not found'), null, 404);
};

router.get('/', healthCheck);
router.post('/', healthCheck);

router.use(require('../middlewares/auth'));

router.use('/file', require('./file'));
router.use('/folder', require('./folder'));
router.use('/usb', require('./usb'));

router.use(notFound);

module.exports = router;
