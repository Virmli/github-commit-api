const port = process.env.NODE_PORT || 4040;

module.exports = {
  port,
  bodyParser: {
    limit: '100kb',
  },
  gitHub: {
    baseUrl: 'https://api.github.com/repos',
    company: 'teradici',
  },
  redis: {
    host: 'localhost',
    port: '6379',
    expirySeconds: 120,
  },
  defaultSince: '2019-06-01', // as provided in challenge documentation
  defaultUntil: '2020-05-31', // as provided in challenge documentation
};
