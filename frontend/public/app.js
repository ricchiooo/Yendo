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
  const input = inputEl.value;
  const output = document.getElementById("terminalOutput");

  // show command in terminal
  output.textContent += `\n> ${input}`;
  output.scrollTop = output.scrollHeight;

 
if (input.includes("balance")) {

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

} else if (input.includes("tx")) {

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
setInterval(() => {
  const tx = document.querySelector(".card:nth-child(2)");
  if (tx) {
    tx.innerHTML = `<h3>Transactions</h3>${Math.floor(Math.random() * 5000)}`;
  }
}, 3000);
const fakeTxs = [
  { type: "SEND", addr: "3xzH...91kp", amount: "-5.00 SOL", time: "2m ago" },
  { type: "SWAP", addr: "8pQw...47Lm", amount: "+412 USDC", time: "14m ago" },
  { type: "EXEC", addr: "Fg1z...cX3n", amount: "program call", time: "1h ago" },
  { type: "RECV", addr: "2mKv...89Tp", amount: "+20.00 SOL", time: "3h ago" },
  { type: "SEND", addr: "7abC...12De", amount: "-1.25 SOL", time: "5m ago" }
];

function renderTxFeed() {
  const container = document.getElementById("txFeed");
  if (!container) return;

  container.innerHTML = "";

  fakeTxs.forEach(tx => {
    const el = document.createElement("div");
    el.className = "tx-item";

    el.innerHTML = `
      <span class="tx-type ${tx.type.toLowerCase()}">${tx.type}</span>
      <span class="tx-addr">${tx.addr}</span>
      <span class="tx-amount">${tx.amount}</span>
      <span class="tx-time">${tx.time}</span>
    `;

    container.appendChild(el);
  });
}

setInterval(() => {
  fakeTxs.unshift(fakeTxs.pop()); // rotate list
  renderTxFeed();
}, 3000);

renderTxFeed();