const express = require("express");
const feedRouter = express.Router();
const User = require("../models/User");
const { userAuth } = require("../middlewares/userAuth");

feedRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(500).send("something went wrong");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

module.exports = {
  feedRouter,
};
