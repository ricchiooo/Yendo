import { SystemProgram, Transaction } from "@solana/web3.js";

export async function sendSol(connection, fromKeypair, to, amount) {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: to,
      lamports: amount * 1e9
    })
  );

  const sig = await connection.sendTransaction(tx, [fromKeypair]);
  await connection.confirmTransaction(sig);
  return sig;
}