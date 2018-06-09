const request = require('supertest');
const express = require('express');
const info = require('../package.json');
const indexHandler = require('../controllers');

const app = express();
app.use(indexHandler);

const expectedData = {
  process: 'Health check',
  version: info.version,
  ok: true,
};

/* eslint no-undef:0 */
describe('Test cases for /controllers/index.js', () => {
  it('GET should return 200 OK upon successful request', (done) => {
    request(app)
      .get('/')
      .expect(200, expectedData, done);
  });
  it('POST should return 200 OK upon successful request', (done) => {
    request(app)
      .post('/')
      .expect(200, expectedData, done);
  });
  it('Request should return 404 Not found to undefined resource', (done) => {
    request(app)
      .get('/blabla')
      .expect(404, done);
  });
});
