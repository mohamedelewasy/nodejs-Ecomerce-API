const mongoose = require("mongoose");
var dbConnection = () => {
  return mongoose.connect(process.env.MONGO_CONNECT)
};

module.exports = dbConnection;