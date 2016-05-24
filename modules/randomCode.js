var random = {};

random.createAccessCode = function() {
  var random = [];
  var code = '';
  var possibilities = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++) {
    random.push(possibilities.charAt(Math.floor(Math.random() * possibilities.length)));
  }
  var extraNum = randomInt(10, 99);
  code = random.join('') + extraNum;
  return code;
};  //  createAccessCode

random.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};  //  randomInt

module.exports = random;
