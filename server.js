import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getBalance } from "./balance.js";
import { sendSol } from "./send.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/balance", async (req, res) => {
  try {
    const balance = await getBalance(process.env.PUBLIC_KEY);
    res.json({ balance });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/send", async (req, res) => {
  try {
    const { to, amount } = req.body;
    const sig = await sendSol(to, amount);
    res.json({ signature: sig });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);