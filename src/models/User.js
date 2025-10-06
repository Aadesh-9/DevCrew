const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: 30,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 30,
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      validate: (val) => {
        if (!validator.isEmail(val)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate: (val) => {
        const specialCharcters = /[!@#$%^&*]/;
        const digits = /\d/;
        if (
          val.length < 8 ||
          !specialCharcters.test(val) ||
          !digits.test(val)
        ) {
          throw new Error(
            "Password must be at least 8 characters long and include a number and special character"
          );
        }
      },
    },
    gender: {
      type: String,
      required: true,
      validate: (value) => {
        if (!["male", "female", "other"].includes(value.toLowerCase())) {
          throw new Error("Gender is not valid");
        }
      },
    },
    avatar_URL: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
      validate: (val) => {
        if (!validator.isURL(val)) {
          throw new Error("Avatar URL is not valid");
        }
      },
    },
    skills: {
      type: [String],
      validate: (val) => {
        if (val.length < 2) {
          throw new Error("At least two skills are required");
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
