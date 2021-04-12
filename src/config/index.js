const env = process.env.APP_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`./${env}`);

config.env = env;

module.exports = config;
