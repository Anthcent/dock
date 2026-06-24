import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env" });

const envSchema = z.object({
  PORT: z.coerce.number().default(5050),
  MONGO_URI: z.string().default("mongodb://localhost:27017/brasa-barrio"),
  WHATSAPP_PHONE: z.string().default("584120000000"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
