const express = require('express');
const utils = require('../utils');
const asustor = require('@rimaulana/asustor-node');

const router = express.Router();

const getFile = (req, res) => {
  asustor.fileInfo(req.params.filename, (error, data) => {
    utils.genericReply(res, error, data);
  });
};

router.get('/:filename', getFile);

module.exports = router;
