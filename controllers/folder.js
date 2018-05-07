const express = require('express');
const mkdirp = require('mkdirp');
const utils = require('../utils');
const asustor = require('@rimaulana/asustor-node');

const router = express.Router();

const createFolder = (req, res) => {
  let folderName = req.params.foldername || req.body.foldername || '';
  if (folderName !== '') {
    folderName = utils.cleanSourcePath(folderName);
    mkdirp(folderName, (error) => {
      const data = { status: `folder ${folderName} created` };
      utils.genericReply(res, error, data);
    });
  } else {
    utils.genericReply(res, new Error('foldername needs to be specified'), null, 400);
  }
};

const getFolder = (req, res) => {
  asustor.folderInfo(req.params.foldername, (error, data) => {
    utils.genericReply(res, error, data);
  });
};

router.get('/:foldername', getFolder);
router.post('/:foldername', createFolder);
router.post('/', createFolder);

module.exports = router;
