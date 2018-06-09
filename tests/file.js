const request = require('supertest');
const express = require('express');
const fileHandler = require('../controllers/file');
const asustor = require('@rimaulana/asustor-node');
const sinon = require('sinon');

const app = express();
app.use('/file', fileHandler);

const expectedData = {
  totalSize: 2700,
  files: [
    {
      path: '/var/www/dummy.js',
      size: 2700,
    },
  ],
};
/* eslint no-undef:0 */
describe('Test cases for /controllers/file.js', () => {
  beforeEach(() => {
    this.stub = sinon.stub(asustor, 'fileInfo');
  });
  afterEach(() => {
    this.stub.restore();
  });
  it('Should return 200 OK upon successful request', (done) => {
    this.stub.callsArgWith(1, null, expectedData);
    request(app)
      .get('/file/%2Fvar%2Fwww%2Fdummy.js')
      .expect(200, expectedData, done);
  });
  it('Should return 404 Not found when filename is not defined', (done) => {
    request(app)
      .get('/file/')
      .expect(404, done);
  });
  it('Should return 500 when error occured in getting file info', (done) => {
    this.stub.callsArgWith(1, new Error('internal error'), null);
    request(app)
      .get('/file/%2Fvar%2Fwww%2Fdummy.js')
      .expect(500, { reason: 'internal error' }, done);
  });
});
