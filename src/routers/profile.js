const express = require("express");
const profileRouter = express.Router();
const User = require("../models/User");
const { userAuth } = require("../middlewares/userAuth");
const {
  validateProfileUpdateData,
  validatePassword,
} = require("../utils/validate");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch {
    res.status(400).send(err.message);
  }
});

//update user Info
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileUpdateData(req)) {
      throw new Error("Invalid updates!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((update) => {
      loggedInUser[update] = req.body[update];
    });
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      user: loggedInUser,
    });
  } catch (err) {
    res.status(500).send("something went wrong" + err.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    if (!(await validatePassword(req))) {
      throw new Error("Your current password in incorrect");
    }
    const user = req.user;
    const usersNewPassword = req.body.newPassword;
    if (!validator.isStrongPassword(usersNewPassword)) {
      throw new Error("Please enter a strong password");
    }
    const usersNewhashedPassword = await bcrypt.hash(usersNewPassword, 7);
    user.password = usersNewhashedPassword;
    await user.save();
    res.status(200).send("Your password is updated successfully");
  } catch (err) {
    res.status(500).send("something went wrong" + err.message);
  }
});

//delete a user by email
profileRouter.delete("/delete", async (req, res) => {
  try {
    const user = await User.deleteOne({ email: req.body.email });
    if (user.deletedCount === 0) {
      res.status(500).send("No user found to delete");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (err) {
    res.status(500).send("something went wrong" + err.message);
  }
});

//put (replace) user Info
profileRouter.put("/replace/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const allowedUpdates = ["skills", "password"];
    const requestedUpdates = Object.keys(req.body);
    const isValidOperation = requestedUpdates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw new Error("Invalid updates!");
    }
    const updates = {};
    requestedUpdates.forEach((key) => {
      updates[key] = req.body[key];
    });
    const user = await User.findOneAndReplace({ _id: userId }, updates, {
      returnDocument: "after",
      runValidators: true,
    });
    if (user) {
      res.status(200).send("user updated successfully" + user);
    } else {
      res.status(404).send("No user found to update");
    }
  } catch (err) {
    res.status(500).send("something went wrong" + err.message);
  }
});

module.exports = {
  profileRouter,
};
