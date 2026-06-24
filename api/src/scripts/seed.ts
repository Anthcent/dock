import mongoose from "mongoose";
import { env } from "../config/env.js";
import { seedMenuIfNeeded } from "../services/menuService.js";

async function seed() {
  await mongoose.connect(env.MONGO_URI);
  await seedMenuIfNeeded();
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
