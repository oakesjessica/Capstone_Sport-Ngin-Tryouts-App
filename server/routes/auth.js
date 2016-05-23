var router = require('express').Router();
var passport = require('passport');
router.get('/sportngin', passport.authenticate('oauth2'));

router.get('/sportngin/callback',
  passport.authenticate('oauth2', {failureRedirect: '/'}),
  function(req, res) {
    res.redirect('/');
  }
);
router.get('/logout', function(req, res){
  console.log('Logging out!!!!');
  req.logout();
  res.redirect('/');
});

router.get('/check', function(req, res) {
  if(req.isAuthenticated()) {
    res.status(200).json({
      success: true
    });
  } else {
    res.status(200).json({
      success: false
    });
  }
});


module.exports = router;
