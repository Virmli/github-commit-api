const router = require('express-promise-router')();

// v1
const v1 = require('./V1/routes');

router.use('/api/v1', v1);

module.exports = router;
