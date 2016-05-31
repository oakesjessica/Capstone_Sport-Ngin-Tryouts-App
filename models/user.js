var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  first_name: {type: String, required: false},
  last_name: {type: String, required: false},
  nginId: {type: String, required: false, unique: true},
  guest: {type: Boolean, required: true, unique: false}
});


module.exports = mongoose.model('User', UserSchema);
