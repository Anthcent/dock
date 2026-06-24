import { describe, expect, it, vi } from "vitest";
import { buildWhatsappMessage, calculateSubtotal, createOrder } from "./orderService.js";
import { OrderModel } from "../models/Order.js";

const sampleInput = {
  customerName: "Vale",
  phone: "04120000000",
  fulfillmentType: "pickup" as const,
  address: "",
  paymentMethod: "Pago movil",
  requestedTime: "20 minutos",
  notes: "Sin cebolla",
  items: [
    {
      slug: "la-carbonera",
      name: "La Carbonera",
      price: 11,
      quantity: 2,
      notes: "",
    },
  ],
};

describe("order service", () => {
  it("calculates the subtotal from all cart items", () => {
    expect(calculateSubtotal(sampleInput.items)).toBe(22);
  });

  it("builds a detailed WhatsApp message", () => {
    const message = buildWhatsappMessage(sampleInput, "BB-AB123");

    expect(message).toContain("BB-AB123");
    expect(message).toContain("La Carbonera");
    expect(message).toContain("Vale");
    expect(message).toContain("Total: $22.00");
  });

  it("creates a persisted order payload", async () => {
    const createSpy = vi.spyOn(OrderModel, "create").mockResolvedValue({
      orderCode: "BB-AB123",
      subtotal: 22,
      whatsappMessage: "mensaje",
    } as never);

    const result = await createOrder(sampleInput);

    expect(createSpy).toHaveBeenCalledOnce();
    expect(result.orderCode).toBe("BB-AB123");
    expect(result.subtotal).toBe(22);
  });
});
