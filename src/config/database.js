const mongoose = require("mongoose");
process.env.DOTENV_CONFIG_QUIET = "true";
require("dotenv").config();

const connectDb = async () => {
  return await mongoose.connect(process.env.MONGODB_CLUSTER_CONNECTION_STRING);
};

module.exports = connectDb;
