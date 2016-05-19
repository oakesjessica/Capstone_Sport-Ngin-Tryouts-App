var router = require('express').Router();
var index = require('./index');

router.use('/', index);

module.exports = router;
