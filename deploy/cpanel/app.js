// Startup file for cPanel "Setup Node.js App" (Passenger or LiteSpeed). Shared hosting
// often sets HOSTNAME to the server's own name, which Next's server would try to bind to;
// listen on all interfaces instead, then start the standalone Next.js server.
process.env.HOSTNAME = "0.0.0.0";

// One line in stderr.log at each start: which server settings the app can see (yes/no
// only, never the values), so a missing or misspelled variable is easy to spot.
const SETTINGS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM", "REQUESTS_NOTIFY_EMAIL"];
console.error(
  `[lamina] started ${new Date().toISOString()} · node ${process.version} · settings: ` +
    SETTINGS.map((k) => `${k}=${process.env[k] ? "yes" : "no"}`).join(" "),
);

// eslint-disable-next-line @typescript-eslint/no-require-imports -- plain CommonJS on the server, like server.js
require("./server.js");
