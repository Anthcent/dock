import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../app.js";
import * as orderService from "../services/orderService.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/orders", () => {
  it("returns a WhatsApp url for a valid order", async () => {
    vi.spyOn(orderService, "createOrder").mockResolvedValue({
      orderCode: "BB-AB123",
      subtotal: 22,
      whatsappMessage: "hola",
    });

    const response = await request(app).post("/api/orders").send({
      customerName: "Vale",
      phone: "04120000000",
      fulfillmentType: "pickup",
      address: "",
      paymentMethod: "Pago movil",
      requestedTime: "20 minutos",
      notes: "",
      items: [{ slug: "la-carbonera", name: "La Carbonera", price: 11, quantity: 2, notes: "" }],
    });

    expect(response.status).toBe(201);
    expect(response.body.orderCode).toBe("BB-AB123");
    expect(response.body.whatsappUrl).toContain("wa.me");
  });

  it("rejects malformed orders before persistence", async () => {
    const response = await request(app).post("/api/orders").send({
      customerName: "",
      phone: "",
      fulfillmentType: "pickup",
      address: "",
      paymentMethod: "",
      requestedTime: "",
      notes: "",
      items: [],
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Datos de pedido invalidos");
  });
});
