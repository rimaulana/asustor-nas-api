const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const folderHandler = require('../controllers/folder');
const asustor = require('@rimaulana/asustor-node');
const sinon = require('sinon');
const utils = require('../utils');

const app = express();
app.use(bodyParser.json());
app.use('/folder', folderHandler);

const expectedData = {
  totalSize: 5000,
  files: [
    {
      path: '/var/www/dummy.js',
      size: 2000,
    },
    {
      path: '/var/www/dummy2.js',
      size: 3000,
    },
  ],
};
/* eslint no-undef:0 */
describe('Test cases for /controllers/folder.js', () => {
  beforeEach(() => {
    this.stub = sinon.stub(asustor, 'folderInfo');
    this.mkdir = sinon.stub(utils, 'mkdirp');
  });
  afterEach(() => {
    this.stub.restore();
    this.mkdir.restore();
  });
  it('GET Should return 200 OK upon successful request', (done) => {
    this.stub.callsArgWith(1, null, expectedData);
    request(app)
      .get('/folder/%2Fvar%2Fwww')
      .expect(200, expectedData, done);
  });
  it('GET Should return 404 Not found when filename is not defined', (done) => {
    request(app)
      .get('/folder/')
      .expect(404, done);
  });
  it('GET Should return 500 when error occured in getting file info', (done) => {
    this.stub.callsArgWith(1, new Error('internal error'), null);
    request(app)
      .get('/folder/%2Fvar%2Fwww')
      .expect(500, { reason: 'internal error' }, done);
  });
  it('POST should return 200 OK upon successful request with argument on param', (done) => {
    this.mkdir.callsArgWith(1, null);
    request(app)
      .post('/folder/%2Fvar%2Fwww')
      .expect(200, { status: 'folder /var/www created' }, done);
  });
  it('POST should return 200 OK upon successful request with arguments on body', (done) => {
    this.mkdir.callsArgWith(1, null);
    request(app)
      .post('/folder/')
      .send({ foldername: '/var/www' })
      .expect(200, { status: 'folder /var/www created' }, done);
  });
  it('POST should return 400 when argument isn\'t defined either in param nor body', (done) => {
    this.mkdir.callsArgWith(1, null);
    request(app)
      .post('/folder/')
      .expect(400, { reason: 'foldername needs to be specified' }, done);
  });
  it('POST should return 500 if folder couldn\'t be created', (done) => {
    this.mkdir.callsArgWith(1, new Error('couldn\'t create folder'));
    request(app)
      .post('/folder/')
      .send({ foldername: '/var/www' })
      .expect(500, { reason: 'couldn\'t create folder' }, done);
  });
});
