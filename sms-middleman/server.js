const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const Transaction = require("./Transaction");

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://user_1:user123@cluster0.cidqadh.mongodb.net/expenseT?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// Your bot token and chat ID
const BOT_TOKEN = "8024805449:AAFaPylVzWFOROx18LOfUHvELnHtCK6Y2GQ";
const CHAT_ID = "1068563532";

// Endpoint for SMS Forwarder to POST
app.post("/sms", async (req, res) => {
  try {
    const { msg, from, time } = req.body; // match your forwarder placeholders

    // Save to MongoDB
    const txn = new Transaction({
      from,
      message: msg,
      time: time ? new Date(time) : new Date(),
    });
    await txn.save();

    // Optional: Send to Telegram bot
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: `From: ${from}\nTime: ${time}\nMessage: ${msg}`,
    });

    console.log("Received SMS:", req.body);
    res.status(200).send({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 Middleman server running on port 3000"));
