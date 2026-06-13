console.log("supabase.js started");

const SUPABASE_URL = "https://catvczdkrwwjauunrqne.supabase.co";
const SUPABASE_KEY = "sb_publishable_eJ1umlFCXUwEs70ReOJarQ_m3aTPlBj";

console.log("About to create client");

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Client created:", client);

window.supabaseClient = client;

console.log("window.supabaseClient =", window.supabaseClient);