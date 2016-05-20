var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var accessCode = new Schema({
  code: {type: String, required: false, unique: true}
});


module.exports = mongoose.model('Code', accessCode);
