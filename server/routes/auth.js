var router = require('express').Router();
var passport = require('passport');
router.get('/sportngin', passport.authenticate('oauth2'));

router.get('/sportngin/callback',
  passport.authenticate('oauth2', {failureRedirect: '/'}),
  function(req, res) {
    res.redirect('/');
  }
);


module.exports = router;
