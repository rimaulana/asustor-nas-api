const express = require('express');
const utils = require('../utils');
const asustor = require('@rimaulana/asustor-node');
// const fse = require('fs-extra');

const router = express.Router();

const getUsb = (req, res) => {
  asustor.usbInfo((error, data) => {
    utils.genericReply(res, error, data);
  });
};

router.get('/', getUsb);

// router.post('/:id', (req, res) => {
//   if (req.body.source) {
//     asustor.usbInfo((error, data) => {
//       if (error) {
//         res.status(500).json({ reason: error.message });
//       } else {
//         let drive = null;
//         for (let i = 0; i < data.drives.length; i++) {
//           if (parseInt(req.params.id) === data.drives[i].index) {
//             drive = data.drives[i];
//             break;
//           }
//         }
//         if (drive === null) {
//           res.status(500).json({ reason: "couldn't find drive you specified" });
//         } else {
//           let src = utils.cleanSourcePath(req.body.source);
//           let dst = `${drive.name  }/${  utils.getFileName(src)}`;
//           asustor.fileInfo(src, (errs, dat) => {
//                         if (errs) {
//                             res.status(500).json({ reason: errs.message });
//                         } else {
//                             if (dat.totalSize > drive.size) {
//                                 res.status(500).json({ reason: "destination drive doesn't have enough space" });
//                             } else {
//                                 fse.copy(src, dst, err => {
//                                     if (err) {
//                                         utils.logger.error(err.message);
//                                     } else {
//                                         utils.logger.info("copied " + src + " to " + dst);
//                                     }
//                                 });
//                                 res.json({ status: "operation success" });
//                             }
//                         }
//                     });
//         }
//       }
//     });
//   } else {
//     res.status(400).json({ reason: 'source needs to be specified' });
//   }
// });

module.exports = route