const API =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://yendo-cli-1.onrender.com";

console.log("Supabase loaded:", supabase); 
window.onload = getBalance;

async function getBalance() {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    console.log("No logged-in user.");
    return;
  }

  const { data: profile, error } =
    await supabaseClient
      .from("profiles")
      .select("wallet_address")
      .eq("id", user.id)
      .single();

  if (error || !profile?.wallet_address) {
    console.error(
      "No wallet found:",
      error
    );

    return;
  }

  const wallet =
    profile.wallet_address;

  const res =
    await fetch(
      `${API}/balance/${wallet}`
    );

  const data =
    await res.json();

  document.getElementById(
    "balanceAmount"
  ).textContent =
    data.balance + " SOL";

  const solPrice = 150;

  document.getElementById(
    "usdValue"
  ).textContent =
    "$" +
    (
      data.balance *
      solPrice
    ).toFixed(2);

  const terminal =
    document.getElementById(
      "terminalOutput"
    );

  if (terminal) {

    terminal.textContent +=
      `\nBalance: ${data.balance} SOL\n`;

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

async function processYendoIntent(input, outputElement) {

  input = input.trim().toLowerCase();

  if (
    input.includes("balance") ||
    input.includes("how much sol") ||
    input.includes("wallet")
  ) {

    await getBalance();

    outputElement.textContent =
      `You currently have ${
        document.getElementById("balanceAmount").textContent
      }.`;

    return;
  }

  if (
    input.includes("transaction") ||
    input.includes("history") ||
    input.includes("recent") ||
    input.includes("tx")
  ) {

    outputElement.textContent =
      "Transaction history is temporarily unavailable while we upgrade this feature.";

    return;
  }

  if (
    input.includes("send")
  ) {

    outputElement.textContent =
      "To send SOL, go to the Send section, enter the recipient address and amount, then confirm the transaction.";

    return;
  }

  if (
    input.includes("phantom") ||
    input.includes("connect wallet")
  ) {

    outputElement.textContent =
      "Click the Connect Phantom button at the top of the dashboard to link your wallet.";

    return;
  }

  if (
    input.includes("help") ||
    input.includes("what can you do")
  ) {

    outputElement.innerHTML = `
<strong>YENDO AI Commands</strong><br><br>

Just type in plain English:<br><br>

• What's my wallet balance?<br>
• How much SOL do I have?<br>
• Show recent transactions<br>
• How do I send SOL?<br>
• How do I connect Phantom?<br>
• Who are you?<br><br>

Type <strong>'help'</strong> to see this menu again.
<em>Try it now — just talk naturally.</em>
`;
    return;
  }

  if (
    input.includes("who are you")
  ) {

    outputElement.textContent =
      "I'm YENDO AI, your Solana wallet assistant.";

    return;
  }

  outputElement.textContent =
    "I don't understand that yet. Try asking for help.";
}
function runCommand() {
  const inputEl = document.getElementById("commandInput");
  const input = inputEl.value.trim().toLowerCase();
  const output = document.getElementById("terminalOutput");

 output.textContent += `\n> ${input}\n`;

const tempOutput = {
  set textContent(value) {
    output.textContent += value + "\n";
    output.scrollTop = output.scrollHeight;
  }
};

processYendoIntent(input, tempOutput);

inputEl.value = "";
}

async function loadTransactionCount() {

  try {

    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const {
      data: profile,
      error
    } = await supabaseClient
      .from("profiles")
      .select("wallet_address")
      .eq("id", user.id)
      .single();

    if (error || !profile?.wallet_address) {
      console.error("Wallet not found");
      return;
    }

    const response =
      await fetch(
        `${API}/transactions/${profile.wallet_address}`
      );

    const data =
      await response.json();

    const txCard =
      document.querySelector(
        ".card:nth-child(2)"
      );

    if (txCard) {

      txCard.innerHTML = `
        <h3>Transactions</h3>
        <p>${data.length}</p>
      `;

    }

  } catch (err) {

    console.error(err);

  }

}
async function loadTransactions() {

  try {

    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const {
      data: profile
    } = await supabaseClient
      .from("profiles")
      .select("wallet_address")
      .eq("id", user.id)
      .single();

    if (!profile?.wallet_address) return;

    const response =
      await fetch(
        `${API}/transactions/${profile.wallet_address}`
      );

    const transactions =
      await response.json();

    const txContainer =
      document.getElementById("txFeed");

    if (!txContainer) return;

    txContainer.innerHTML = "";

    transactions.forEach((tx) => {

      const txElement =
        document.createElement("div");

      const shortSig =
        tx.signature.slice(0, 8) +
        "..." +
        tx.signature.slice(-6);

      const time =
        new Date(
          tx.blockTime * 1000
        ).toLocaleString();

      txElement.classList.add(
        "tx-item"
      );

      txElement.innerHTML = `
        <p><strong>Signature</strong>: ${shortSig}</p>
        <p><strong>Status</strong>: ${tx.confirmationStatus} ✅</p>
        <p><strong>Time</strong>: ${time}</p>
      `;

      txContainer.appendChild(
        txElement
      );

    });

  } catch (err) {

    console.error(
      "Transaction fetch failed:",
      err
    );

  }

}

// Transactions temporarily disabled
// loadTransactionCount();
// loadTransactions();
async function signUp() {

  const email =
    document.getElementById("signupEmail").value;

  const password =
    document.getElementById("signupPassword").value;

  const { data, error } =
    await supabaseClient.auth.signUp({
      email,
      password
    });

  const message =
    document.getElementById("authMessage");

  if (error) {

    message.textContent =
      "❌ " + error.message;

    return;

  }

  message.textContent =
    "✅ Account created successfully";

}
function toggleLoginPassword() {
  const input = document.getElementById("loginPassword");

  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

function toggleSignupPassword() {
  const input = document.getElementById("signupPassword");

  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}
async function connectWallet() {

  if (!window.solana || !window.solana.isPhantom) {
    alert("Phantom Wallet is not installed.");
    return;
  }

  try {

    const response = await window.solana.connect();

    const walletAddress =
      response.publicKey.toString();

    document.getElementById(
      "walletAddress"
    ).textContent =
      "Wallet: " + walletAddress;
const {
  data: { user }
} = await supabaseClient.auth.getUser();

if (user) {

  const { error } = await supabaseClient
  .from("profiles")
  .update({
    wallet_address: walletAddress
  })
  .eq("id", user.id);

console.log("Update error:", error);

if (error) {
  alert(
    "WALLET SAVE ERROR: " +
    JSON.stringify(error)
  );
} else {
  alert("Wallet saved successfully!");
}

}
    console.log(
      "Connected wallet:",
      walletAddress
    );

  } catch (err) {

    console.error(err);

    alert("Wallet connection cancelled.");

  }

}
async function askYendoAI() {

  const input =
    document.getElementById("aiInput").value;

  const response =
    document.getElementById("aiResponse");

  await processYendoIntent(
    input,
    response
  );

}