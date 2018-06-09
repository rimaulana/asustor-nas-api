const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const usbHandler = require('../controllers/usb');
const asustor = require('@rimaulana/asustor-node');
const sinon = require('sinon');
const fse = require('fs-extra');

const app = express();
app.use(bodyParser.json());
app.use('/usb', usbHandler);

const expectedUSBData = {
  totalAvailableSpace: 300,
  drives: [
    {
      name: '/share/USB1',
      size: 100,
      index: 1,
    },
    {
      name: '/share/USB5',
      size: 200,
      index: 5,
    },
  ],
};

const expectedFileDataMax = {
  totalSize: 2700,
  files: [
    {
      path: '/var/www/data',
      size: 2700,
    },
  ],
};

const expectedFileDataMin = {
  totalSize: 50,
  files: [
    {
      path: '/var/www/data',
      size: 50,
    },
  ],
};

/* eslint no-undef:0 */
describe('Test cases for /controllers/usb.js', () => {
  beforeEach(() => {
    this.usbInfo = sinon.stub(asustor, 'usbInfo');
    this.fileInfoSync = sinon.stub(asustor, 'fileInfoSync');
    this.usbInfoSync = sinon.stub(asustor, 'usbInfoSync');
    this.fse = sinon.stub(fse, 'copy');
  });
  afterEach(() => {
    this.usbInfo.restore();
    this.fileInfoSync.restore();
    this.usbInfoSync.restore();
    this.fse.restore();
  });
  it('GET should return 200 OK upon successful request', (done) => {
    this.usbInfo.callsArgWith(0, null, expectedUSBData);
    request(app)
      .get('/usb/')
      .expect(200, expectedUSBData, done);
  });
  it('POST should return 400 when source is not defined', (done) => {
    request(app)
      .post('/usb/1')
      .expect(400, { reason: 'source needs to be specified' }, done);
  });
  it('POST should return 500 when destination drive could\'t be found', (done) => {
    this.usbInfoSync.returns(expectedUSBData);
    request(app)
      .post('/usb/2')
      .send({ source: '/var/www/data/' })
      .expect(500, { reason: 'couldn\'t find drive you specified' }, done);
  });
  it('POST should return 500 when destination drive doesn\'t have enough space', (done) => {
    this.usbInfoSync.returns(expectedUSBData);
    this.fileInfoSync.returns(expectedFileDataMax);
    request(app)
      .post('/usb/1')
      .send({ source: '/var/www/data/' })
      .expect(500, { reason: 'destination drive doesn\'t have enough space' }, done);
  });
  it('POST should return 200 OK upon successful request', (done) => {
    this.usbInfoSync.returns(expectedUSBData);
    this.fileInfoSync.returns(expectedFileDataMin);
    this.fse.callsArgWith(2, null);
    request(app)
      .post('/usb/1')
      .send({ source: '/var/www/data/' })
      .expect(200, { status: 'operation success' }, done);
  });
  it('POST should return 200 OK upon successful request', (done) => {
    this.usbInfoSync.returns(expectedUSBData);
    this.fileInfoSync.returns(expectedFileDataMin);
    this.fse.callsArgWith(2, new Error('internal error'));
    request(app)
      .post('/usb/5')
      .send({ source: '/var/www/data/' })
      .expect(200, { status: 'operation success' }, done);
  });
});
