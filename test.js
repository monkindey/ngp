const exec = require('child_process').exec;
const assert = require('assert');

const co = require('co');
const json = require('./package.json');
const ngp = require('./index.js');
const pExec = require('./util.js').pExec;

/**
 * 1. how to test async with mocha
 * http://staxmanade.com/2015/11/testing-asyncronous-code-with-mochajs-and-es7-async-await/
 * 2. npm install slow and mocha will timeout
 * https://stackoverflow.com/questions/16607039/in-mocha-testing-while-calling-asynchronous-function-how-to-avoid-the-timeout-er
 * 3. if your npm install will arise the EACCESS permission deny problem, see below
 * https://docs.npmjs.com/getting-started/fixing-npm-permissions
 */
describe('take the node global package', () => {
  it('should include npg package', done => {
    co(function*() {
      const res = yield pExec('npm i ngp -g');
	  console.log(res);
      const pkgs = yield ngp();
      console.log(`${json.name}@${json.version}`);
      assert.ok(pkgs.indexOf(`${json.name}@${json.version}`) !== -1);
      done();
    });
  });
});
