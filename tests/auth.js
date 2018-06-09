const request = require('supertest');
const express = require('express');
const auth = require('../middlewares/auth');
const bodyparser = require('body-parser');
const config = require('../config');

const app = express();
app.use(bodyparser.json());

const success = (req, res) => {
  res.json({ status: 'ok' });
};

app.use('/', auth, success);

/* eslint no-undef:0 */
describe('Test cases for /middlewares/auth.js', () => {
  it('Should return 200 OK upon successful authentication using header field', (done) => {
    request(app)
      .get('/')
      .set('x-access-token', config.api_keys[0])
      .expect(200, { status: 'ok' }, done);
  });
  it('Should return 200 OK upon successful authentication using query field', (done) => {
    request(app)
      .get(`/?token=${config.api_keys[0]}`)
      .expect(200, { status: 'ok' }, done);
  });
  it('Should return 200 OK upon successful authentication using body field', (done) => {
    request(app)
      .get('/')
      .send({ token: config.api_keys[0] })
      .expect(200, { status: 'ok' }, done);
  });
  it('Should return 403 access token required when token isn\'t set', (done) => {
    request(app)
      .get('/')
      .expect(403, { reason: 'access token required' }, done);
  });
  it('Should return 403 access token invalid when token isn\'t valid', (done) => {
    request(app)
      .get('/?token=invalidtoken')
      .expect(403, { reason: 'access token invalid' }, done);
  });
});
