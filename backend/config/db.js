const mongoose = require("mongoose");
const colors = require("colors");

const ConnectionDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB Connected : ${(await conn).connection.host}`.bgWhite.blue
    );
  } catch (error) {
    console.log(`Error:${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = ConnectionDB;
