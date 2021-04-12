const qs = require('query-string');

class HelperFunctions {
  /**
     * Converts human format YYYY-MM-DD to ISO YYYY-MM-DDTHH:MM:SSZ
     * @param humanDate
     * @returns {string}
     */
  static dateToISO8601(humanDate) {
    const date = new Date(humanDate);

    return date.toISOString();
  }

  /**
     * Adds date filter parameters to GitHub url.
     * @param url
     * @param since
     * @param until
     * @returns {string}
     */
  addDateFiltersToRequest(url, since, until) {
    return `${url}?since=${HelperFunctions.dateToISO8601(since)}&until=${HelperFunctions.dateToISO8601(until)}`;
  }

  /**
     * As Github pagination information can be found from response header
     * this function will provide parsing capabilities of header.link
     * @param header
     * @returns {number}
     */
  extractPaginationInfo(header) {
    if (header.length === 0) {
      throw new Error('Input must not be of zero length');
    }

    if (!header.link) {
      return 1;
    }
    // Split parts by comma
    const parts = header.link.split(',');
    let numberOfPages = 0;

    // Parse each part into a named link
    parts.forEach((item) => {
      const section = item.split(';');
      if (section.length !== 2) {
        throw new Error("Section could not be split on ';'");
      }
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      if (name === 'last') {
        numberOfPages = parseInt(qs.parse(url).page);
      }
    });

    return numberOfPages;
  }

  sortTopFiveCommiters(commitCounter) {
    const response = [];
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

    return response;
  }
}

module.exports = HelperFunctions;
