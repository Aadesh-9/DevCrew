const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");

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

//delete a user by email
app.delete("/delete", async (req, res) => {
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

//update user Info
app.patch("/update/:id", async (req, res) => {
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

    const user = await User.findByIdAndUpdate({ _id: userId }, updates, {
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

//put (replace) user Info
app.put("/replace/:id", async (req, res) => {
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

app.all("/", (req, res) => {
  res.send("server is running");
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
