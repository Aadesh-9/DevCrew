const express = require("express");

const app = express();

app.get("/user", (req, res, next) => {
  res.send("Hello from server");
  next();
});

app.listen(7777, () => {
  console.log("server is running on port 7777");
});
