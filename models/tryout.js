var mongoose = require('mongoose')
var Schema = mongoose.Schema;

// This schema keeps track of tryout title and all category input fields (grouped in an array)
// Link user_id
var tryoutSchema = new Schema({
  tryout_title: { type: String, required: true},
  date: { type: Date, required: true},
  categories: { type: Array, required: true},
  user_id: { type: Schema.ObjectId, ref: 'UserSchema'},
  code: {type: String, required: false, unique: true}
});


module.exports = mongoose.model('Code', tryoutSchema);
