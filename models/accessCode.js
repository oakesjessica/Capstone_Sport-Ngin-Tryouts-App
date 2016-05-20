var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var accessCodeSchema = new Schema({
  code: {type: String, required: false, unique: true},
  tryout_id: {type:Schema.ObjectId, ref:'tryoutSchema'},
  user_id: {type:Schema.ObjectId, ref:'UserSchema'}
});


module.exports = mongoose.model('Code', accessCodeSchema);
