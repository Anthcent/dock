import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchMenu, submitOrder } from "./api";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("api helpers", () => {
  it("returns fetched menu data when the API responds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ brand: { name: "Brasa", phone: "1", tagline: "x" }, items: [] }),
      }),
    );

    const result = await fetchMenu();

    expect(result.brand.name).toBe("Brasa");
  });

  it("falls back to local data when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));

    const result = await fetchMenu();

    expect(result.items.length).toBeGreaterThan(0);
  });

  it("submits orders to the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ orderCode: "BB-AB123", subtotal: 20, whatsappMessage: "hola", whatsappUrl: "https://wa.me/1" }),
      }),
    );

    const result = await submitOrder({
      customerName: "Vale",
      phone: "04120000000",
      fulfillmentType: "pickup",
      address: "",
      paymentMethod: "Pago movil",
      requestedTime: "20 minutos",
      notes: "",
      items: [{ slug: "burger", name: "Burger", price: 10, quantity: 2, notes: "" }],
    });

    expect(result.orderCode).toBe("BB-AB123");
  });
});
