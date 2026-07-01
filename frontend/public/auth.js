console.log("auth.js loaded");

async function signUp() {

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://yendo-cli.vercel.app"
    }
  });

  const message = document.getElementById("authMessage");

  if (error) {
    message.textContent = "We couldn't create your account. Please check your details and try again.";
    return;
  }

  message.textContent =
    message.textContent =
  "Your account has been created. Please check your email to verify your account before signing in.";

}

async function login() {

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  const message = document.getElementById("authMessage");

  if (error) {
    message.textContent =
  "Sign in failed. Please check your email and password, then try again.";
    return;
  }

  const user = data.user;

  const { data: existingProfile } =
    await supabaseClient
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

  if (!existingProfile) {

    const { error: insertError } =
      await supabaseClient
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: user.email
          }
        ]);

    if (insertError) {
      console.error(insertError);
    }

  }

  message.textContent =
  "Welcome back! Redirecting to your dashboard...";

  setTimeout(() => {
    window.location.href = "/dashboard.html";
  }, 1000);

}

async function resetPassword() {

  const email =
    document.getElementById("loginEmail").value;

  if (!email) {
    document.getElementById("authMessage").textContent =
  "Please enter the email address associated with your account.";
    return;
  }

  const { error } =
    await supabaseClient.auth.resetPasswordForEmail(email);

  if (error) {
    document.getElementById("authMessage").textContent =
  "We couldn't send a password reset email. Please try again.";
    return;
  }

  document.getElementById("authMessage").textContent =
  "Password reset instructions have been sent to your email.";

}

async function logout() {

  await supabaseClient.auth.signOut();

  window.location.href = "/index.html";

}

function toggleLoginPassword() {

  const input =
    document.getElementById("loginPassword");

  input.type =
    input.type === "password"
      ? "text"
      : "password";

}

async function protectDashboard() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "/index.html";
  }

}

if (
  window.location.pathname.includes("dashboard")
) {
  protectDashboard();
}