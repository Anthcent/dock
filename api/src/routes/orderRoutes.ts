import { Router } from "express";
import { env } from "../config/env.js";
import { createOrder } from "../services/orderService.js";

export const orderRouter = Router();

orderRouter.post("/", async (request, response, next) => {
  try {
    const created = await createOrder(request.body);
    const encoded = encodeURIComponent(created.whatsappMessage);
    const whatsappUrl = `https://wa.me/${env.WHATSAPP_PHONE}?text=${encoded}`;

    response.status(201).json({
      ...created,
      whatsappUrl,
    });
  } catch (error) {
    next(error);
  }
});
