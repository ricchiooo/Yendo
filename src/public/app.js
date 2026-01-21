const API = "";

async function getBalance() {
  const res = await fetch(`${API}/balance`);
  const data = await res.json();
  document.getElementById("balanceResult").textContent =
    JSON.stringify(data, null, 2);
}

async function sendSol() {
  const to = document.getElementById("to").value;
  const amount = document.getElementById("amount").value;

  const res = await fetch(`${API}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, amount })
  });

  const data = await res.json();
  document.getElementById("sendResult").textContent =
    JSON.stringify(data, null, 2);
}