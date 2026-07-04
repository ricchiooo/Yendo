const API =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://yendo-cli-1.onrender.com";

console.log("Supabase loaded:", supabase); 
window.onload = () => {

  document.getElementById(
    "balanceAmount"
  ).textContent =
    "Connect Wallet";

  document.getElementById(
    "usdValue"
  ).textContent =
    "$0.00";

};
let pendingAmount = null;
let pendingRecipient = null;
let monitoringActive = false;
let lastKnownBalance = null;
async function getBalance() {

  if (!window.solana?.publicKey) {

    document.getElementById(
      "balanceAmount"
    ).textContent =
      "0 SOL";

    document.getElementById(
      "usdValue"
    ).textContent =
      "$0.00";

    return;
  }

  const connection =
  new solanaWeb3.Connection(
    "https://solana-rpc.publicnode.com",
    "processed"
  );

  const balance =
    await connection.getBalance(
      window.solana.publicKey
    );

  const solBalance =
    balance /
    solanaWeb3.LAMPORTS_PER_SOL;

  document.getElementById(
    "balanceAmount"
  ).textContent =
    solBalance.toFixed(6) +
    " SOL";

  const response = await fetch(
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
);

const priceData = await response.json();

const solPrice = priceData.solana.usd;

  document.getElementById(
    "usdValue"
  ).textContent =
    "$" +
    (
      solBalance *
      solPrice
    ).toFixed(2);

}

async function startWalletMonitoring() {

  monitoringActive = true;

  await getBalance();

  const currentBalance =
    document.getElementById(
      "balanceAmount"
    ).textContent;

  lastKnownBalance =
    currentBalance;

  setInterval(async () => {

    if (!monitoringActive)
      return;

    await getBalance();

    const newBalance =
      document.getElementById(
        "balanceAmount"
      ).textContent;

    if (
      newBalance !==
      lastKnownBalance
    ) {

      document.getElementById(
        "aiResponse"
      ).innerHTML =
        `
        <strong>
        Balance Change Detected
        </strong>

        <br><br>

        Old:
        ${lastKnownBalance}

        <br>

        New:
        ${newBalance}
        `;

      lastKnownBalance =
        newBalance;
    }

  }, 10000);

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
      data.signature;
  } else {
    document.getElementById("sendResult").textContent =
      "Transaction failed ❌\n\n" + JSON.stringify(data, null, 2);
  }

  await getBalance();

  document.getElementById("to").value = "";
  document.getElementById("amount").value = "";
}

async function executeSolTransfer(amount, recipient) {

  try {

    if (!window.solana?.isPhantom) {
      alert("Please connect Phantom first.");
      return;
    }

    const provider = window.solana;

    const connection =
  new solanaWeb3.Connection(
    "https://solana-rpc.publicnode.com",
    "processed"
  );

    const fromPubkey =
      provider.publicKey;
console.log(
  "Sending from:",
  fromPubkey.toString()
);
console.log(
  "Sending from:",
  provider.publicKey.toString()
);
console.log(
  "Sending to:",
  recipient
);

console.log(
  "Amount:",
  amount
);
    const toPubkey =
      new solanaWeb3.PublicKey(
        recipient
      );

    const transaction =
  new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: Math.floor(
        Number(amount) *
        solanaWeb3.LAMPORTS_PER_SOL
      )
    })
  );
  console.log(
  "Lamports:",
  Math.floor(
    Number(amount) *
    solanaWeb3.LAMPORTS_PER_SOL
  )
);
      transaction.feePayer =
  fromPubkey;

const latestBlockhash =
  await connection.getLatestBlockhash();

transaction.recentBlockhash =
  latestBlockhash.blockhash;
  transaction.feePayer =
  fromPubkey;
console.log(
  "Balance before send:",
  await connection.getBalance(
    fromPubkey
  )
);
console.log(transaction);
console.log(
  "Fee payer:",
  transaction.feePayer?.toString()
);

console.log(
  "Recent blockhash:",
  transaction.recentBlockhash
);
console.log(
  "Instruction:",
  transaction.instructions[0]
);

console.log(
  "Lamports being sent:",
  transaction.instructions[0].data
);

console.log(
  "All instructions:",
  transaction.instructions
);
console.log(
  "Connected wallet:",
  provider.publicKey.toString()
);

const balance =
  await connection.getBalance(
    provider.publicKey
  );

console.log(
  "Mainnet balance:",
  balance
);
const result =
  await provider.signAndSendTransaction(
    transaction
  );
const txStatus =
  await connection.getSignatureStatuses([
    result.signature
  ]);

const status =
  txStatus.value[0];
  if (
  status &&
  status.err
) {
  throw new Error(
    JSON.stringify(status.err
    )
  );
}
  console.log(
  "Transaction result:",
  result
);
    await connection.confirmTransaction({
  signature: result.signature,
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight:
    latestBlockhash.lastValidBlockHeight
});

    return {
  success: true,
  signature:
    result.signature
};

  } catch (err) {

    console.error(
  "TRANSFER ERROR:",
  err
);

    throw err;

  }

}

async function processYendoIntent(input, outputElement) {
console.log("INPUT:", input);
  const originalInput = input.trim();

input = originalInput.toLowerCase();
const sendMatch =
  originalInput.match(
    /(send|transfer|pay)\s+([\d.]+)\s*sol\s+to\s+([A-Za-z0-9]+)/i
  );

if (sendMatch) {

  const amount =
    sendMatch[2];

  const recipient =
    sendMatch[3];

    pendingAmount = amount;
pendingRecipient = recipient;
  outputElement.innerHTML = `
  <div class="transaction-confirmation">
    <strong>Transaction Detected</strong><br><br>
    
    <strong>Amount:</strong> ${amount} SOL<br><br>
    <strong>Recipient:</strong><br>
    ${recipient}<br><br>

    <div class="confirm-buttons">
      <button onclick="confirmTransaction()" class="confirm-btn">Confirm</button>
      <button onclick="cancelTransaction()" class="cancel-btn">Cancel</button>
    </div>
  </div>
`;

  return;
}
  if (
    input.includes("balance") ||
    input.includes("how much sol") ||
    input.includes("how much sol do i have")
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

  outputElement.innerHTML = `
    <strong>Send SOL with YENDO AI</strong>

    <br><br>

    Example:

    <br>
    Send 0.5 SOL to Fe8ek...

    <br>
    Transfer 1 SOL to 6YkKd...

    <br><br>

    YENDO will prepare the transaction and ask for confirmation through Phantom.
  `;

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
if (
  input.includes("wallet address") ||
  input.includes("my address")
) {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    outputElement.textContent =
      "Please log in first.";
    return;
  }

  const {
    data: profile,
    error
  } = await supabaseClient
    .from("profiles")
    .select("wallet_address")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !profile?.wallet_address
  ) {
    outputElement.textContent =
      "No wallet connected yet. Connect Phantom first.";
    return;
  }

  outputElement.innerHTML = `
    <strong>Your Wallet Address:</strong><br><br>
    ${profile.wallet_address}
  `;

  return;

}

if (
  input.includes("receive sol") ||
  input.includes("how do i receive")
) {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  const {
    data: profile
  } = await supabaseClient
    .from("profiles")
    .select("wallet_address")
    .eq("id", user.id)
    .single();

  outputElement.innerHTML = `
    <strong>How to Receive SOL</strong><br><br>

    1. Copy your wallet address.<br>
    2. Share it with the sender.<br>
    3. Wait for the transaction to confirm.<br><br>

    <strong>Your Address:</strong><br>
    ${profile?.wallet_address ||
      "No wallet connected."}
  `;

  return;

}

if (
  input.includes("send sol") ||
  input.includes("how do i send")
) {

  outputElement.innerHTML = `
    <strong>How to Send SOL</strong><br><br>

    1. Get the recipient's wallet address.<br>
    2. Decide how much SOL you want to send.<br>
    3. Use YENDO's send functionality.<br>
    4. Review the details carefully.<br>
    5. Confirm the transaction.<br><br>

    Always verify wallet addresses before sending funds.
  `;

  return;

}

if (
  input.includes("what can you do")
) {

  outputElement.innerHTML = `
    <strong>YENDO AI Capabilities</strong><br><br>

    • Check wallet balances<br>
    • Show recent transactions<br>
    • Display your wallet address<br>
    • Explain how to send SOL<br>
    • Explain how to receive SOL<br>
    • Help connect Phantom Wallet<br>
    • Answer YENDO questions<br><br>

    More capabilities coming soon.
  `;

  return;

}
if (
  input.includes("monitor my wallet") ||
  input.includes("monitor wallet") ||
  input.includes("watch my wallet")
) {

  await startWalletMonitoring();

  outputElement.innerHTML =
    `
    <strong>
    Wallet Monitoring Started
    </strong>

    <br><br>

    Current Balance:
    ${document.getElementById(
      "balanceAmount"
    ).textContent}
    `;

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
  // Check if Phantom is available
  if (!window.solana || !window.solana.isPhantom) {
    alert("Phantom Wallet is not installed.\n\nPlease install Phantom from the app store and try again.");
    
    // Optional: Open Phantom download page
    window.open("https://phantom.app/download", "_blank");
    return;
  }

  try {
    const response = await window.solana.connect();
    const walletAddress = response.publicKey.toString();

    console.log("Connected wallet:", walletAddress);

    // Update UI
    document.getElementById('balanceAmount').textContent = "Connected";

    // Save to Supabase (your existing logic)
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
      const { error } = await supabaseClient
        .from("profiles")
        .update({ wallet_address: walletAddress })
        .eq("id", user.id);

      if (error) {
        console.error("Wallet save error:", error);
      } else {
        console.log("Wallet saved successfully!");
      }
    }

    // Fetch balance
    try {
      await getBalance();
    } catch (err) {
      console.error("Balance fetch failed:", err);
    }

  } catch (err) {
    console.error(err);
    alert("Wallet connection was cancelled or failed.");
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
async function confirmTransaction() {

  try {

    document.getElementById(
      "aiResponse"
    ).innerHTML =
      "Opening Phantom...";

    const result =
  await executeSolTransfer(
    pendingAmount,
    pendingRecipient
  );

const signature = result.signature;
const {
  data: { session }
} = await supabaseClient.auth.getSession();

if (session) {

  const { error: dbError } =
    await supabaseClient
      .from("transactions")
      .insert([
        {
          user_id: session.user.id,
          wallet_address: session.user.user_metadata?.wallet_address || window.solana.publicKey.toString(),
          type: "send",
          token: "SOL",
          amount: pendingAmount,
          signature: signature,
          status: "confirmed"
        }
      ]);

  if (dbError) {
  console.error("Supabase transaction log failed:");
  console.error("Code:", dbError.code);
  console.error("Message:", dbError.message);
  console.error("Details:", dbError.details);
  console.error("Hint:", dbError.hint);
}

}
    document.getElementById(
      "aiResponse"
    ).innerHTML = `
      <strong>Transaction Sent ✅</strong>
      <br><br>

      Signature:
      <br>
      ${signature}

      <br><br>

      <a
        href="https://explorer.solana.com/tx/${signature}"
        target="_blank"
      >
        View Transaction
      </a>
    `;

    await getBalance();

  } catch (err) {

  console.error(err);

  let friendlyError =
    "Transaction failed. Please try again.";

  if (
    JSON.stringify(err)
      .includes("InsufficientFundsForRent")
  ) {

    friendlyError =
      "Recipient wallet is not properly funded for this transaction.";

  }

  document.getElementById(
    "aiResponse"
  ).innerHTML = `
    <strong>Transaction Failed ❌</strong>

    <br><br>

    ${friendlyError}
  `;

}
}

function cancelTransaction() {

  document.getElementById(
    "aiResponse"
  ).innerHTML =
    "Transaction cancelled.";

}