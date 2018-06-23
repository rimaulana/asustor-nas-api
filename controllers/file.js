const express = require('express');
const utils = require('../utils');
const asustor = require('@rimaulana/asustor-node');

const router = express.Router();

const getFile = (req, res) => {
  utils.getFunction(res, asustor.fileInfo, req.params.filename);
};

router.get('/:filename', getFile);

module.exports = router;
