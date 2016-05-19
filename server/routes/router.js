var router = require('express').Router();
var index = require('./index');
var partials = require('./partials');

router.use('/app/view', partials);
router.use('/', index);

module.exports = router;
