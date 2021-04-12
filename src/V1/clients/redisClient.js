const Redis = require('redis');
const Config = require('../../config');

class Cache {
  static get EXPIRY_SECONDS() {
    return Config.redis.expirySeconds;
  }

  constructor() {
    const redisConfig = Config.redis; // We can add our retry function here if/when needed

    this.Client = this._createRedisClient(redisConfig);
    this.Client.on('error', (error) => {
      // here we can create loggers for errors
    });
    this.Client.on('connect', () => {
      // console.info('Redis Connection Successful...');
    });
  }

  async getObjectFromCache(key) {
    return new Promise((resolve, reject) => {
      this._getFromRedis(resolve, reject, key);
    });
  }

  async setObjectToCache(key, obj, expirySeconds) {
    return Promise.resolve(this._setToRedis(key, JSON.stringify(obj), expirySeconds));
  }

  async keyExists(key) {
    return new Promise((resolve, reject) => {
      this.Client.exists(key, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  closeConnection() {
    this.Client.quit();
  }

  // Private methods
  _createRedisClient(redisConfig) {
    return Redis.createClient(redisConfig);
  }

  _getFromRedis(resolve, reject, key) {
    this.Client.get(key, (err, reply) => {
      if (err) {
        reject(err);
      }

      resolve(JSON.parse(reply));
    });
  }

  _setToRedis(key, val, expirySeconds = Cache.EXPIRY_SECONDS) {
    this.Client.set(key, val, 'EX', expirySeconds);
  }
}

module.exports = new Cache();
