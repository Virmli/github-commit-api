const router = require('express-promise-router')();
const cloudAccessManagerService = require('./services/cloudAccessManagerService');
const cloudAccessManagerEndpoint = require('./endpoints/cloudAccessManagerEndpoint');

router.get('/users', (req, res, next) => cloudAccessManagerEndpoint.getUsers(cloudAccessManagerService, req, res, next));
router.get('/most-frequent', (req, res, next) => cloudAccessManagerEndpoint.getMostFrequentUsers(cloudAccessManagerService, req, res, next));

module.exports = router;
