const API =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://yendo-cli-1.onrender.com";

const wallet = "CryX4FRYdYB4SyUZ3qyxBKG3g68mFG6qZrbzha38Piwc";

window.onload = getBalance;

async function getBalance() {
  const res = await fetch(`${API}/balance/${wallet}`);
  const data = await res.json();

  document.getElementById("balanceResult").textContent =
    `Wallet: ${data.address}

Balance: ${Number(data.balance).toFixed(4)} SOL`;
}

async function sendSol() {
  const to = document.getElementById("to").value;
  const amount = document.getElementById("amount").value;

  const confirmTx = confirm(`Send ${amount} SOL to ${to}?`);
  if (!confirmTx) return;

  const res = await fetch(`${API}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, amount })
  });

  const data = await res.json();

  if (data.signature) {
    document.getElementById("sendResult").textContent =
      "Transaction sent ✅\n\n" +
      "Signature: " + data.signature + "\n\n" +
      "View on Explorer:\n" +
      "https://explorer.solana.com/tx/" +
      data.signature +
      "?cluster=devnet";
  } else {
    document.getElementById("sendResult").textContent =
      "Transaction failed ❌\n\n" + JSON.stringify(data, null, 2);
  }

  await getBalance();

  document.getElementById("to").value = "";
  document.getElementById("amount").value = "";
}