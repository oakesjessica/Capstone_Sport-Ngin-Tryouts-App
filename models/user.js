var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}},
  first: {type: String, required: false},
  last: {type: String, required: false}
});


module.exports = mongoose.model('User', UserSchema);
