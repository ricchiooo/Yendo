import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export function getConnection() {
  return new Connection(
    process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
    "confirmed"
  );
}

export function getKeypair() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY missing in environment variables");
  }

  const secretKey = bs58.decode(process.env.PRIVATE_KEY);
  return Keypair.fromSecretKey(secretKey);
}