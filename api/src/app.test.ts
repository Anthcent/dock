import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("app shell", () => {
  it("exposes a health endpoint", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
