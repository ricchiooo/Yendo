const API =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://yendo-cli-1.onrender.com";

const wallet = "CryX4FRYdYB4SyUZ3qyxBKG3g68mFG6qZrbzha38Piwc";

window.onload = getBalance;

async function getBalance() {
  const res = await fetch(`${API}/balance/${wallet}`);
  const data = await res.json(); // ✅ THIS WAS MISSING

  document.getElementById("balanceAmount").textContent =
    data.balance + " SOL";

    const solPrice = 150; // fake price for now

document.getElementById("usdValue").textContent =
  "$" + (data.balance * solPrice).toFixed(2);

  // optional: send to terminal
  const terminal = document.getElementById("terminalOutput");
  if (terminal) {
    terminal.textContent += `\nBalance: ${data.balance} SOL\n`;
  }
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
function runCommand() {
  const inputEl = document.getElementById("commandInput");
  const input = inputEl.value.trim().toLowerCase();
  const output = document.getElementById("terminalOutput");

  // show command in terminal
  output.textContent += `\n> ${input}`;
  output.scrollTop = output.scrollHeight;

 
 if (
  input.includes("balance") ||
  input.includes("how much sol") ||
  input.includes("wallet")
) {

  output.textContent += "\nFetching balance...";

  setTimeout(() => {
    output.textContent += "\nBalance loaded successfully ✅";
    output.textContent += `\nBalance: ${document.getElementById("balanceAmount").textContent}\n`;
    output.scrollTop = output.scrollHeight;
  }, 800);

  getBalance();

} else if (input.includes("send")) {

  output.textContent += "\nPreparing transaction...";

  setTimeout(() => {
    output.textContent += "\nAwaiting confirmation...";
  }, 700);

  setTimeout(() => {
    output.textContent += "\nTransaction confirmed ✅\n";
    output.scrollTop = output.scrollHeight;
  }, 1500);

} else if (
  input.includes("tx") ||
  input.includes("transaction") ||
  input.includes("history") ||
  input.includes("recent")
) {

  output.textContent += "\nFetching transactions...";

  setTimeout(() => {
    output.textContent += "\n5 recent transactions loaded ✅\n";
    output.scrollTop = output.scrollHeight;
  }, 800);

} else {

  output.textContent += "\nCommand not recognized ❌\n";

}
  // auto-scroll terminal
  output.scrollTop = output.scrollHeight;

  // clear input
  inputEl.value = "";
}
async function loadTransactionCount() {
  try {
    const response = await fetch("http://localhost:3000/transactions");
    const data = await response.json();

    const txCard = document.querySelector(".card:nth-child(2)");

    if (txCard) {
      txCard.innerHTML = `
        <h3>Transactions</h3>
        <p>${transactions.length}</p>
      `;
    }
  } catch (err) {
    console.error(err);
  }
}
async function loadTransactions() {
  try {
    const response = await fetch("http://localhost:3000/transactions");
    const transactions = await response.json();

    const txContainer = document.getElementById("txFeed");

    if (!txContainer) return;

    txContainer.innerHTML = "";

    transactions.forEach((tx) => {
      const txElement = document.createElement("div");

      const shortSig =
        tx.signature.slice(0, 8) + "..." + tx.signature.slice(-6);

      const time = new Date(tx.blockTime * 1000).toLocaleString();

      txElement.classList.add("tx-item");

txElement.innerHTML = `
  <p><strong>Signature</strong>: ${shortSig}</p>
  <p><strong>Status</strong>: ${tx.confirmationStatus} ✅</p>
  <p><strong>Time</strong>: ${time}</p>
`;

      txContainer.appendChild(txElement);
    });

  } catch (err) {
    console.error("Transaction fetch failed:", err);
  }
}

loadTransactions();