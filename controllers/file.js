const express = require('express');
const utils = require('../utils');
const asustor = require('@rimaulana/asustor-node');

const router = express.Router();

const getFile = (req, res) => {
  if (req.params.filename) {
    asustor.fileInfo(req.params.filename, (error, data) => {
      utils.genericReply(res, error, data);
    });
  } else {
    utils.genericReply(res, new Error('filename needs to be specified'), null, 400);
  }
};

router.get('/:filename', getFile);

module.exports = router;
