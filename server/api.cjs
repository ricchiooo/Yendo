const wallet = require("./wallet.cjs");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") }); // MUST BE FIRST

// 1️⃣ Imports
const cors = require("cors");
const express = require("express");
const path = require("path");

const {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction
} = require("@solana/web3.js");

// 🔥 IMPORT YOUR WALLET LOGIC
const { getKeypair } = require("./wallet.cjs");

// 2️⃣ App setup
const app = express();
app.use(cors());
app.use(express.json());

// 3️⃣ Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

// 4️⃣ Solana connection
const connection = new Connection("https://api.devnet.solana.com");

// 5️⃣ Load wallet (ENV-based)
let sender;

try {
  sender = getKeypair();
  console.log("✅ Wallet loaded:", sender.publicKey.toBase58());
} catch (err) {
  console.log("⚠️ Wallet not configured:", err.message);
}

/* ---------------- BALANCE ---------------- */

app.get("/balance/:address", async (req, res) => {
  try {
    const address = req.params.address;

    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);

    res.json({
      address,
      balance: balance / 1e9
    });

  } catch (error) {
    res.status(400).json({
      error: "Invalid wallet address"
    });
  }
});

/* ---------------- SEND SOL ---------------- */

app.post("/send", async (req, res) => {
  if (!sender) {
    return res.status(500).json({
      error: "Wallet not configured on server"
    });
  }

  try {
    const { to, amount } = req.body;

    if (!to || !amount) {
      return res.status(400).json({
        error: "Missing recipient or amount"
      });
    }

    const recipient = new PublicKey(to);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipient,
        lamports: amount * 1e9
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [sender]
    );

    res.json({
      success: true,
      signature
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// 6️⃣ Start server (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`YENDO API running on port ${PORT}`);
});