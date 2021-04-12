const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');

// express
const app = express();

const { version } = require('../package.json');
// readiness & liveness probe endpoint
app.get('/version', (req, res) => {
  res.json({ version });
});

// 3rd party middleware
app.use(bodyParser.json(config.bodyParser));

app.use(require('./routes'));

// export server
module.exports = http.createServer(app);
