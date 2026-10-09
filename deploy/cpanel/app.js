// Startup file for cPanel "Setup Node.js App" (Passenger). Shared hosting often sets
// HOSTNAME to the server's own name, which Next's server would try to bind to; listen on
// all interfaces instead, then start the standalone Next.js server.
process.env.HOSTNAME = "0.0.0.0";
// eslint-disable-next-line @typescript-eslint/no-require-imports -- plain CommonJS on the server, like server.js
require("./server.js");
