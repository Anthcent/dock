import { describe, expect, it, vi } from "vitest";
import { MenuItemModel } from "../models/MenuItem.js";
import { menuSeed } from "../data/seed-menu.js";
import { getMenu, seedMenuIfNeeded } from "./menuService.js";

describe("menu service", () => {
  it("returns persisted menu items when mongo has data", async () => {
    const lean = vi.fn().mockResolvedValue([menuSeed[0]]);
    const sort = vi.fn().mockReturnValue({ lean });

    vi.spyOn(MenuItemModel, "find").mockReturnValue({ sort } as never);

    const result = await getMenu();

    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("la-carbonera");
  });

  it("falls back to the seed menu when mongo is empty", async () => {
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });

    vi.spyOn(MenuItemModel, "find").mockReturnValue({ sort } as never);

    const result = await getMenu();

    expect(result).toHaveLength(menuSeed.length);
  });

  it("inserts seed data only when the collection is empty", async () => {
    const countSpy = vi.spyOn(MenuItemModel, "countDocuments");
    const insertSpy = vi.spyOn(MenuItemModel, "insertMany").mockResolvedValue([] as never);

    countSpy.mockResolvedValueOnce(0 as never);
    await seedMenuIfNeeded();

    expect(insertSpy).toHaveBeenCalledOnce();

    insertSpy.mockClear();
    countSpy.mockResolvedValueOnce(2 as never);
    await seedMenuIfNeeded();

    expect(insertSpy).not.toHaveBeenCalled();
  });
});
