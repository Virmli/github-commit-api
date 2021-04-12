const config = require('./config');
const server = require('./server');

server.listen(process.env.PORT || config.port, () => {
  console.log(`Started on port ${server.address().port}`);
});
