const { exec } = require('child_process');

/**
 * Run command
 * @param {String} cmd
 * @param {Function} callback
 */
const runCmd = (cmd, callback) => {
  console.info(`*** Starting running ${cmd}. ***`);

  const cmdProcess = exec(cmd);

  cmdProcess.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
  cmdProcess.stdout.on('data', (data) => console.info(data.toString()));
  cmdProcess.stderr.on('data', (err) => {
    console.error(err);
    process.exit(1);
  });

  cmdProcess.on('exit', (data) => {
    if (String(data) === '1') process.exit(1);
    console.info(data);
    console.info(`*** Finished running ${cmd}. ***`);
    if (callback) callback(data);
  });
};

module.exports = runCmd;
