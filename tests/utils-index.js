
const utils = require('../utils');
const { expect } = require('chai');

/* eslint no-undef:0 */
describe('Test cases for /utils/index.js', () => {
  it('Should return the IP address', () => {
    const ipAddress = '172.16.1.1';
    expect(utils.cleanIPAddress(ipAddress)).to.be.equal(ipAddress);
  });
  it('Should return cleaned IPv4 address', () => {
    const rawIP = '::1:172.16.1.1';
    const ipAddress = '172.16.1.1';
    expect(utils.cleanIPAddress(rawIP)).to.be.equal(ipAddress);
  });
  it('should clean source path', () => {
    const rawPath = '/var/www/';
    const expectedPath = '/var/www';
    expect(utils.cleanSourcePath(rawPath)).to.be.equal(expectedPath);
  });
});
