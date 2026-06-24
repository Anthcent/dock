import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { menuRouter } from "./routes/menuRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(","),
  }),
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Datos de pedido invalidos",
      issues: error.issues,
    });
    return;
  }

  response.status(500).json({
    message: error instanceof Error ? error.message : "Unexpected error",
  });
});
