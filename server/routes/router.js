var router = require('express').Router();
var index = require('./index');
var partials = require('./partials');

router.use('/app/partials', partials);
router.use('/', index);

module.exports = router;
