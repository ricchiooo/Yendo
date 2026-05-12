const { Keypair } = require("@solana/web3.js");
const fs = require("fs");

const WALLET_PATH = "./yendo-wallet.json";

function getKeypair() {
  // If wallet already exists → load it
  if (fs.existsSync(WALLET_PATH)) {
    const secret = JSON.parse(fs.readFileSync(WALLET_PATH));
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  }

  // Else → create new wallet
  const keypair = Keypair.generate();

  fs.writeFileSync(
    WALLET_PATH,
    JSON.stringify(Array.from(keypair.secretKey))
  );

  console.log("🆕 New wallet created:", keypair.publicKey.toBase58());

  return keypair;
}

module.exports = { getKeypair };