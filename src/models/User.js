const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: 30,
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
    },
    gender: {
      type: String,
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
      // validate: (val) => {
      //   if (val.length < 2) {
      //     throw new Error("At least two skills are required");
      //   }
      // },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  const doesPasswordMatch = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );
  return doesPasswordMatch;
};

module.exports = mongoose.model("user", userSchema);
