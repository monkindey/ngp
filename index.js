/**
 * https://stackoverflow.com/questions/5926672/where-does-npm-install-packages
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const co = require('co');

function isWin() {
  return os.platform() === 'win32';
}

function pExec(command) {
  return new Promise(resolve => {
    const process = exec(command);
    let res = [];
    process.stdout.setEncoding('utf-8');
    process.stdout.on('data', chunk => {
      res.push(chunk);
    });
    process.stdout.on('end', () => {
      resolve(res.join(''));
    });
  });
}

function pReadFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.toString());
    });
  });
}

module.exports = function getGlobalPkg() {
  return co(function*() {
    const rawNpmGlobalPkgs = yield pExec('npm ls -g -depth 0');
    const NpmGlobalPkgs = rawNpmGlobalPkgs.match(/([\w-_\.]+@[0-9\.]+)$/gm);
    let yarnPath;
    if (isWin()) {
      yarnPath = '%LOCALAPPDATA%/Yarn/config/global';
    } else {
      // 不能用`~/.config/yarn/global`
      yarnPath = `${os.homedir()}/.config/yarn/global`;
    }

    const pkgs = require(path.join(yarnPath, 'package.json'));
    const yarnGlobalPkgsName = Object.keys(
      Object.assign({}, pkgs.dependencies, pkgs.devDependencies)
    );

    const yarnGlobalPkgs = yarnGlobalPkgsName.map(name => {
      const version = require(path.join(
        yarnPath,
        'node_modules',
        name,
        'package.json'
      )).version;

	  return `${name}@${version}`
    });

    return yield NpmGlobalPkgs.concat(yarnGlobalPkgs);
  });
};
