import { MenuItemModel } from "../models/MenuItem.js";
import { menuSeed } from "../data/seed-menu.js";

export async function getMenu() {
  const items = await MenuItemModel.find().sort({ featured: -1, category: 1, name: 1 }).lean();

  if (items.length > 0) {
    return items;
  }

  return menuSeed;
}

export async function seedMenuIfNeeded() {
  const count = await MenuItemModel.countDocuments();

  if (count === 0) {
    await MenuItemModel.insertMany(menuSeed);
  }
}
