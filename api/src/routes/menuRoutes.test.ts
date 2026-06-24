import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../app.js";
import { menuSeed } from "../data/seed-menu.js";
import * as menuService from "../services/menuService.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/menu", () => {
  it("returns the brand shell and menu items", async () => {
    vi.spyOn(menuService, "getMenu").mockResolvedValue(menuSeed);

    const response = await request(app).get("/api/menu");

    expect(response.status).toBe(200);
    expect(response.body.brand.name).toBe("Brasa de Barrio");
    expect(response.body.items).toHaveLength(menuSeed.length);
  });

  it("returns a 500 response when the menu service fails", async () => {
    vi.spyOn(menuService, "getMenu").mockRejectedValue(new Error("mongo down"));

    const response = await request(app).get("/api/menu");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("mongo down");
  });
});
