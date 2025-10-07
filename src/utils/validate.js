const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, email, password, gender, skills } = req.body;

  if (!firstName || !password || !email || !skills || !gender) {
    throw new Error("Missing required fields");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include a number and special character"
    );
  }
};

module.exports = { validateSignUpData };
