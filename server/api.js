const express = require("express");
const { Connection, PublicKey } = require("@solana/web3.js");

const app = express();

const connection = new Connection("https://api.devnet.solana.com");

app.get("/balance/:address", async (req, res) => {

  try {

    const address = req.params.address;

    const publicKey = new PublicKey(address);

    const balance = await connection.getBalance(publicKey);

    res.json({
      address,
      balance: balance / 1000000000
    });

  } catch (error) {

    res.status(400).json({
      error: "Invalid wallet address"
    });

  }

});

app.listen(3000, () => {
  console.log("YENDO API running on port 3000");
});