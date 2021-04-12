const hash = require('object-hash');

const gitHubClient = require('../clients/gitHubClient');
const HelperFunctionsClass = require('../utils/helperFunctions');

const helperFunctions = new HelperFunctionsClass();
const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

/**
 * Returns the users for everyone that has committed
 * code to https://github.com/teradici/deploy during the
 * period from June 1, 2019 - May 31,2020. Also store response
 * to Redis Cache for 2 min in order to improve performance of the system.
 *
 * NOTE: I assumed that we dont need to filter duplications in this api.
 * @param req
 * @returns {Promise<*>}
 */
module.exports.getListOfUsers = async (req, cache) => {
  // we are creating a hash from request in order to save response to redis.
  const redisKey = hash(req.originalUrl);

  console.log('Getting List of users who committed to repo.');
  console.log('Redis Key:  ', redisKey);
  const checkCash = await cache.keyExists(redisKey);
  if (checkCash) {
    console.log('We have list of users cached in redis with a key: ', redisKey);
    return cache.getObjectFromCache(redisKey);
  }

  const listOfCommits = await gitHubClient.getListOfCommits();

  const users = listOfCommits.map((commit) => ({
    name: commit.commit.author.name,
    email: commit.commit.author.email,
  }));

  // save response to redis
  console.log(`Filtered list of users save to cache: ${JSON.stringify(users)}`);
  await cache.setObjectToCache(redisKey, users);

  return users;
};

/**
 * This service returns the number of commits which occurred
 * from June 1, 2019 - May 31, 2020, associated with the author, and
 * and filters them to contain the top 5 committers.
 * @param req
 * @param cache
 * @returns {Promise<[]>}
 */
module.exports.getTopFiveCommitters = async (req, cache) => {
  // we are creating a hash from request in order to save response to redis.
  const redisKey = hash(req.originalUrl);
  const { start, end } = req.query;
  let getListOfCommitsArgs = [];
  if (start && end) {
    if (dateRegex.test(start) && dateRegex.test(end)) {
      getListOfCommitsArgs = [start, end];
    } else {
      return { error: 'wrong date format' };
    }
  }

  const commitCounter = {};

  console.log('Getting List of users who committed to repo.');
  console.log('Redis Key:  ', redisKey);
  const checkCash = await cache.keyExists(redisKey);

  if (checkCash) {
    console.log('We have Top Five Commiters cached in redis with a key: ', redisKey);
    return cache.getObjectFromCache(redisKey);
  }

  const listOfCommits = await gitHubClient.getListOfCommits.apply(this, getListOfCommitsArgs);
  listOfCommits.forEach((commit) => {
    if (commitCounter[commit.commit.author.name]) {
      commitCounter[commit.commit.author.name] += 1;
    } else {
      commitCounter[commit.commit.author.name] = 1;
    }
  });

  const response = helperFunctions.sortTopFiveCommiters(commitCounter);
  // save response to redis
  console.log(`Top five commiters save to cache: ${JSON.stringify(response)}`);
  await cache.setObjectToCache(redisKey, response);

  return response;
};
