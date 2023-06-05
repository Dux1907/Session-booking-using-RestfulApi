const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  student: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Session", sessionSchema);
