var router = require('express').Router();
var path = require('path');

router.get('/*', function(req, res){
  res.render(path.join(__dirname, '../public/views/app.jade'));
});

module.exports = router;
