const hash = require('object-hash');

const gitHubClient = require('../clients/gitHubClient');

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

  const commitCounter = {};
  const response = [];

  console.log('Getting List of users who committed to repo.');
  console.log('Redis Key:  ', redisKey);
  const checkCash = await cache.keyExists(redisKey);

  if (checkCash) {
    console.log('We have Top Five Commiters cached in redis with a key: ', redisKey);
    return cache.getObjectFromCache(redisKey);
  }

  const listOfCommits = await gitHubClient.getListOfCommits();
  listOfCommits.forEach((commit) => {
    if (commitCounter[commit.commit.author.name]) {
      commitCounter[commit.commit.author.name] += 1;
    } else {
      commitCounter[commit.commit.author.name] = 1;
    }
  });

  const sortedResult = [];
  for (const user in commitCounter) {
    sortedResult.push([user, commitCounter[user]]);
  }
  // we doing reverse sort result will be from high to low.
  sortedResult.sort((a, b) => b[1] - a[1]);

  for (let i = 0; i < sortedResult.length; i++) {
    if (i >= 5) {
      i = sortedResult.length;
    } else {
      response.push({
        name: sortedResult[i][0],
        commits: sortedResult[i][1],
      });
    }
  }

  // save response to redis
  console.log(`Top five commiters save to cache: ${JSON.stringify(response)}`);
  await cache.setObjectToCache(redisKey, response);

  return response;
};
