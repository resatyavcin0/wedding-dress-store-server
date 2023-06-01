const mongoose = require("mongoose");

module.exports.databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("App connected to database");
  } catch (err) {
    console.log("error: " + err);
  }
};
