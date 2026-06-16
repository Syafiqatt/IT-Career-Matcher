import app from "./app.js";
import { config } from "./config/index.js";

const server = app.listen(config.port, () => {
  console.log(`🚀 API berjalan di http://localhost:${config.port}`);
  console.log(`   ML service: ${config.mlServiceUrl}`);
});

// Cegah proses mati mendadak akibat error yang tidak tertangani.
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});

export default server;
