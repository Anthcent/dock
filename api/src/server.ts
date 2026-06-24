import mongoose from "mongoose";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { seedMenuIfNeeded } from "./services/menuService.js";

async function start() {
  await mongoose.connect(env.MONGO_URI);
  await seedMenuIfNeeded();

  app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
