const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);
// module.exports = mongoose.model("user", userSchema);
module.exports = { User };
