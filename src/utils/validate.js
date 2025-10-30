const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignUpData = (req) => {
  const { email, password } = req.body;

  if (!password || !email) {
    throw new Error("Missing required fields");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include a number and special character"
    );
  }
};

validateProfileUpdateData = (req) => {
  const allowedUpdates = ["firstName", "lastName", "avatar_URL", "skills"];
  const requestedUpdates = req.body;
  const isUpdateAllowed = Object.keys(requestedUpdates).every((update) => {
    return allowedUpdates.includes(update);
  });

  return isUpdateAllowed;
};

validatePassword = async (req) => {
  const loggedInUser = req.user;
  const userTypedInCurrPassword = req.body.currrentPassword;
  const isPasswordCorrect = await bcrypt.compare(
    userTypedInCurrPassword,
    loggedInUser.password
  );
  return isPasswordCorrect;
};

module.exports = {
  validateSignUpData,
  validateProfileUpdateData,
  validatePassword,
};
