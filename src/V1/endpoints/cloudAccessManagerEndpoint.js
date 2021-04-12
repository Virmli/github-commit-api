const safeStringify = require('fast-safe-stringify');

const cache = require('../clients/redisClient');

/**
 *
 * @param cloudAccessManagerService
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports.getUsers = async (cloudAccessManagerService, req, res, next) => {
  try {
    const response = await cloudAccessManagerService.getListOfUsers(req, cache);

    return res.status(200).json(response);
  } catch (error) {
    safeStringify(error);

    return next(error);
  }
};

/**
 *
 * @param cloudAccessManagerService
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports.getMostFrequentUsers = async (cloudAccessManagerService, req, res, next) => {
  try {
    const response = await cloudAccessManagerService.getTopFiveCommitters(req, cache);

    return res.status(200).json(response);
  } catch (error) {
    safeStringify(error);

    return next(error);
  }
};
