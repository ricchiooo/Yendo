console.log("auth.js loaded");
async function signUp() {
  console.log("Signup button clicked");

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  const message = document.getElementById("authMessage");

  if (error) {
    message.textContent = "❌ " + error.message;
    return;
  }

  const user = data.user;

  if (user) {

  alert("Attempting profile insert");

  const { data: profileData, error: profileError } =
    await supabaseClient
      .from("profiles")
      .insert([
        {
          id: user.id,
          email: user.email
        }
      ])
      .select();

  alert(
    "Insert result: " +
    JSON.stringify(profileError || profileData)
  );

  console.log("Profile Data:", profileData);
  console.log("Profile Error:", profileError);
}

  message.textContent = "✅ Account created successfully";

  setTimeout(() => {
    window.location.href = "/public/dashboard.html";
  }, 1500);
}
async function login() {
  console.log("Login button clicked");

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
  
console.log(data);
console.log(error);
  const message = document.getElementById("authMessage");

  if (error) {
    message.textContent = "❌ " + error.message;
    return;
  }

  message.textContent = "✅ Login successful";

  setTimeout(() => {
  window.location.href = "/public/dashboard.html";
}, 1000);
}

async function resetPassword() {
  const email = document.getElementById("loginEmail").value;

  if (!email) {
    document.getElementById("authMessage").textContent =
      "❌ Enter your email first";
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

  if (error) {
    document.getElementById("authMessage").textContent =
      "❌ " + error.message;
    return;
  }

  document.getElementById("authMessage").textContent =
    "✅ Password reset email sent";
}

async function logout() {
  await supabaseClient.auth.signOut();

  window.location.href = "/public/index.html";
}
function toggleLoginPassword() {
  const input = document.getElementById("loginPassword");

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}
async function protectDashboard() {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "/public/index.html";
  }
}
if (
  window.location.pathname.includes("dashboard")
) {
  protectDashboard();
}