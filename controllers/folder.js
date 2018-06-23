const express = require('express');
const utils = require('../utils');
const asustor = require('@rimaulana/asustor-node');

const router = express.Router();

const createFolder = (req, res) => {
  let folderName = req.params.foldername || req.body.foldername || '';
  if (folderName !== '') {
    folderName = utils.cleanSourcePath(folderName);
    utils.mkdirp(folderName, (error) => {
      const data = { status: `folder ${folderName} created` };
      utils.genericReply(res, error, data);
    });
  } else {
    utils.genericReply(res, new Error('foldername needs to be specified'), null, 400);
  }
};

const getFolder = (req, res) => {
  utils.getFunction(res, asustor.folderInfo, req.params.foldername);
};

router.get('/:foldername', getFolder);
router.post('/:foldername', createFolder);
router.post('/', createFolder);

module.exports = router;
