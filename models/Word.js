var mongoose = require('mongoose');

var WordSchema = new mongoose.Schema({
  word: String,
  translation: String,
  pronouce: String
});

module.exports = mongoose.model('Word', WordSchema);