const express = require("express");
const app = express();
const connectDB = require("./config/database");
const { User } = require("./models/User");

app.post("/signup", async (req, res) => {
  try {
    const user = new User({
      firstName: "ana",
      lastName: "de armas",
      age: 25,
      gender: "female",
    });
    await user.save();
    res.send("Data added successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
