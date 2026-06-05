require("dotenv").config();

const mongoose = require("mongoose");
console.log(process.env.DB_CONNECTION);
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;
