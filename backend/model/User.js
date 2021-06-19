const mongoose = require("mongoose");
const statuses = require("./Status");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  status: {
    type: String,
    min: 6,
    max: 30,
    default: statuses.WORKING,
  },
});

module.exports = mongoose.model("User", userSchema);
