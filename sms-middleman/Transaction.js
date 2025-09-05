const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  from: String,
  message: String,
  time: Date,
});

module.exports = mongoose.model("Transaction", transactionSchema);
