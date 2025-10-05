const express = require("express");
const app = express();
const connectDB = require("./config/database");
const { User } = require("./models/User");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("Data added successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

//get a user data by finding via first user with given email
app.get("/userData", async (req, res) => {
  try {
    const users = await User.find({ email: "sydney@sweeny.com" });
    if (users.length === 0) {
      res.status(500).send("something went wrong");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

//get all users
app.get("/feed", async (req, res) => {
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
