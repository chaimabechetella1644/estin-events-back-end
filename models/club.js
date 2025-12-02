const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // hashed
  description: String,
  logo: String
});

module.exports = mongoose.model('Club', ClubSchema);
