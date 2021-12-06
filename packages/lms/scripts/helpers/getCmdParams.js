const packageJson = require('../../package.json');
/**
 * Check if required options are available: env, version, cdnUrl
 * @param {Object} args
 */
const getOptions = (args) => {
  let { env, version, cdnUrl } = args;
  env = env || 'production';
  if (!version) {
    version = packageJson.version;
  }
  cdnUrl = cdnUrl || `https://content.illumidesk.com/lms/${version}/`;

  return { env, cdnUrl, version };
};

module.exports = getOptions;
