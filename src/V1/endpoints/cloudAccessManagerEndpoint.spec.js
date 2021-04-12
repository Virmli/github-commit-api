const axios = require('axios');
const cache = require('../clients/redisClient');

const gitHubCommitersMockRepspons = require('../../mocks/gitHubCommitersMockRespons');
const endpoints = require('./cloudAccessManagerEndpoint');
const services = require('../services/cloudAccessManagerService');

const mockReq = {
  originalUrl: 'hello/test',
};
const mockNext = jest.fn();
const mockRes = {
  type: jest.fn(() => mockRes),
  status: jest.fn(() => mockRes),
  send: jest.fn(() => mockRes),
  json: jest.fn(() => mockRes),
};

jest.mock('axios');
jest.mock('../clients/redisClient');

describe('Cloud Access Manager Endpoint Test', () => {
  beforeEach(() => {
    cache.keyExists.mockResolvedValue(undefined);
    cache.setObjectToCache.mockResolvedValue({});
    cache._createRedisClient.mockImplementation(() => {});
  });

  it('should make get commiters call successful', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(gitHubCommitersMockRepspons));

    await endpoints.getUsers(services, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenLastCalledWith(200);
    expect(mockRes.json).toHaveBeenLastCalledWith([
      {
        name: 'cptera',
        email: 'cptera@users.noreply.github.com',
      },
    ]);
  });

  it('should make get commiters call error', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('something went wrong')));

    await endpoints.getUsers(services, mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error('something went wrong'));
  });

  it('should make get top 5 commiters call successful', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(gitHubCommitersMockRepspons));

    await endpoints.getMostFrequentUsers(services, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenLastCalledWith(200);
    expect(mockRes.json).toHaveBeenLastCalledWith([
      {
        name: 'cptera',
        commits: 1,
      },
    ]);
  });

  it('should make get top 5 commiters call 500 response', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      status: 500,
      data: 'Broken msg',
    }));

    await endpoints.getMostFrequentUsers(services, mockReq, mockRes, mockNext);

    expect(mockNext)
      .toHaveBeenLastCalledWith(new Error('something went wrong'));
  });
});
