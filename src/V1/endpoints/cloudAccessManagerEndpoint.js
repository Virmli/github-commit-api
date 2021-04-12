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
module.exports.getUsers = async (cloudAccessManagerService, req, res) => {
  try {
    const response = await cloudAccessManagerService.getListOfUsers(req, cache);

    return res.status(200).json(response);
  } catch (error) {
    safeStringify(error);

    // Note in ideal world we need to create error handling classes
    // with correct error status, messages etc.
    // Examples: BadRequest, NotFound, ServerError etc.
    return res.status(500).json({
      error: error.message || 'Unknown Error',
    });
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
module.exports.getMostFrequentUsers = async (cloudAccessManagerService, req, res) => {
  try {
    const response = await cloudAccessManagerService.getTopFiveCommitters(req, cache);

    return res.status(200).json(response);
  } catch (error) {
    safeStringify(error);

    return res.status(500).json({
      error: error.message || 'Unknown Error',
    });
  }
};
