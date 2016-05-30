var router = require('express').Router();
var index = require('./index');
var partials = require('./partials');
var auth = require('./auth');


router.use('/app/view', partials);
router.use('/auth', auth);



//Keep at bottom
router.use('/', index);

module.exports = router;
