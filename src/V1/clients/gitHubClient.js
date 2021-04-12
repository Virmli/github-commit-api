const axios = require('axios');

const config = require('../../config');

const { baseUrl, company } = config.gitHub;
const { defaultSince, defaultUntil } = config;
const HelperFunctionsClass = require('../utils/helperFunctions');

const helperFunctions = new HelperFunctionsClass();

/**
 * Function to call git hub endpoint to return
 * list of commits with detailed information to specific company meeting
 */
const getListOfCommits = async () => {
  let url = `${baseUrl}/${company}/deploy/commits`;
  url = helperFunctions.addDateFiltersToRequest(url, defaultSince, defaultUntil);

  // Solution is based on GitHub documentation. I can talk on our discussion call more about
  // different approaches we can take her.

  // INFO: From GitHub docs; Information about pagination is provided
  // in the Link header of an API call.
  // Let's break that down. rel="next" says that the next page is page=2.
  // This makes sense, since by default, all paginated queries start
  // at page 1. rel="last" provides some more information,
  // stating that the last page of results is on page 34.
  // Always rely on these link relations provided to you.
  // Don't try to guess or construct your own URL.
  console.log('Pagination initial call number 1.  URL: ', url);
  const initialCall = await axios.get(url);

  if (initialCall.status === 500) {
    throw new Error('something went wrong');
  }
  const numberOfPages = helperFunctions.extractPaginationInfo(initialCall.headers);
  let result = initialCall.data;

  // we always start with 2nd page because of initial call.
  for (let i = 2; i <= numberOfPages; i++) {
    // NOTE: we can also set max number of response objects to 100
    // but default 30 is also works like a charm.
    console.log(`Pagination call number ${i}.  URL: `, `${url}&page=${i}`);
    const response = await axios.get(`${url}&page=${i}`);

    if (response.status === 500) {
      throw new Error('something went wrong');
    }

    result = result.concat(response.data);
  }

  return result;
};

module.exports = {
  getListOfCommits,
};
