const exec = require('child_process').exec;

function pExec(command) {
  return new Promise((resolve, reject) => {
    const executor = exec(command, (err, res) => {
      if (err) {
        reject(err);
      }else {
        resolve(res);
      }
    });

    process.on('exit', function() {
      executor.kill();
    });
  });
}

module.exports = {
  pExec
};
