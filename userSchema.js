const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: String,
});

module.exports = mongoose.model('User', userSchema);
