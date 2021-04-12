const axios = require('axios');

const gitHubCommitersMockRepspons = require('../../mocks/gitHubCommitersMockRespons');

jest.mock('axios');

const gitHubClient = require('./gitHubClient');

describe('GitHub Client Test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should make get commiters call successful', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(gitHubCommitersMockRepspons));

    const response = await gitHubClient.getListOfCommits();

    expect(response).toEqual(gitHubCommitersMockRepspons.data);
  });

  // it('should make get commiters call fail', async () => {
  //   axios.get.mockImplementationOnce(() => Promise.resolve(gitHubCommitersMockRepspons));
  //
  //   const response = await gitHubClient.getListOfCommits();
  //
  //   expect(response).toEqual(gitHubCommitersMockRepspons.data);
  // });
});
