const express = require('express');
const utils = require('../utils');
const asustor = require('@rimaulana/asustor-node');
const fse = require('fs-extra');

const router = express.Router();

const getUsb = (req, res) => {
  asustor.usbInfo((error, data) => {
    utils.genericReply(res, error, data);
  });
};

router.get('/', getUsb);

const postHandler = async (req) => {
  let drive = null;
  try {
    const data = asustor.usbInfoSync();
    data.drives.forEach((drv) => {
      if (parseInt(req.params.id, 10) === drv.index) {
        drive = drv;
      }
    });
    if (drive === null) {
      throw new Error("couldn't find drive you specified");
    }
    const src = utils.cleanSourcePath(req.body.source);
    const dst = `${drive.name}/${utils.getFileName(src)}`;
    const fileInfo = asustor.fileInfoSync(src);
    if (fileInfo.totalSize > drive.size) {
      throw new Error("destination drive doesn't have enough space");
    }
    return { src, dst };
  } catch (error) {
    throw error;
  }
};

router.post('/:id', (req, res) => {
  if (req.body.source) {
    postHandler(req)
      .then((data) => {
        fse.copy(data.src, data.dst, (err) => {
          if (err) {
            utils.logger.error(`error in copying ${data.src} to ${data.dst}, error message: ${err.message}`);
          } else {
            utils.logger.info(`copied ${data.src} to ${data.dst}`);
          }
        });
        res.json({ status: 'request is being processed' });
      })
      .catch(error => res.status(500).json({ reason: error.message }));
  } else {
    res.status(400).json({ reason: 'source needs to be specified' });
  }
});

module.exports = router;
