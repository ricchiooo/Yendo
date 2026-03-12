import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getBalance } from "./src/balance.js";
import { sendSol } from "./src/send.js";
import { getConnection, getKeypair } from "./src/wallet.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = getConnection();
const keypair = getKeypair();

app.get("/balance", async (req, res) => {
  try {
    const balance = await connection.getBalance(keypair.publicKey);
    res.json({
      address: keypair.publicKey.toBase58(),
      balance: balance / 1e9
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/send", async (req, res) => {
  try {
    const { to, amount } = req.body;
    const sig = await sendSol(connection, keypair, to, amount);
    res.json({ signature: sig });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("YENDO API running on port", PORT);
});