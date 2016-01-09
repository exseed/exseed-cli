import chai from 'chai';
const expect = chai.expect;

describe('#hello', () => {
  it('should print hello message', (done) => {
    const exec = require('child_process').exec;
    exec('node ./dist/index.js hello', (error, stdout, stderr) => {
      expect(stdout).to.equal(
        'hello, this is a hello message from exseed command line tool\n');
      done();
    });
  });
});