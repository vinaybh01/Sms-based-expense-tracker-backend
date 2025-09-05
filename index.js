const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Replace with your Bot Token
const token = "8024805449:AAFaPylVzWFOROx18LOfUHvELnHtCK6Y2GQ";
const bot = new TelegramBot(token, { polling: true });

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://user_1:user123@cluster0.cidqadh.mongodb.net/expenseT",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ Error connecting MongoDB Atlas:", err));

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  chatId: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const Transaction = mongoose.model("Transaction", TransactionSchema);

// Listen for messages
bot.on("message", async (msg) => {
  console.log("FULL MSG:", msg); // 👈 log everything

  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(`Received from ${chatId}: ${text}`);

  if (!text) return;

  const txn = new Transaction({ chatId, message: text });
  await txn.save();

  bot.sendMessage(chatId, "Transaction saved ✅");
});

app.post("/transaction", async (req, res) => {
  const { chatId, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const txn = new Transaction({ chatId: chatId || "manual-test", message });
  await txn.save();

  res.json({ success: true, txn });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
