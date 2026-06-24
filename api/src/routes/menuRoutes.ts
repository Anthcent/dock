import { Router } from "express";
import { getMenu } from "../services/menuService.js";

export const menuRouter = Router();

menuRouter.get("/", async (_request, response, next) => {
  try {
    const items = await getMenu();
    response.json({
      brand: {
        name: "Brasa de Barrio",
        phone: "584120000000",
        tagline: "Hamburguesas de costra viva y humo corto.",
      },
      items,
    });
  } catch (error) {
    next(error);
  }
});
