var mongoose = require('mongoose')
var Schema = mongoose.Schema;

// This schema keeps track of tryout title and all category input fields (grouped in an array)
// Link user_id
var tryoutSchema = new Schema({
  title: { type: String, required: true},
  date: { type: Date, required: true},
  categories: { type: Array, 'default': [] },
  user_id: { type: Schema.ObjectId, ref: 'UserSchema'},
  code: {type: String, required: false, unique: true, sparse: true},
  players: { type: Array, 'default': []},
  dateString: String
});


module.exports = mongoose.model('Tryout', tryoutSchema);
