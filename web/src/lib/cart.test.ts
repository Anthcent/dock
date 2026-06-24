import { describe, expect, it } from "vitest";
import { addItemToCart, cartSubtotal, updateCartQuantity } from "./cart";

const baseItem = {
  slug: "la-carbonera",
  name: "La Carbonera",
  tagline: "",
  description: "",
  category: "smash" as const,
  price: 11,
  heat: "suave" as const,
  featured: true,
  image: "",
  accent: "#000",
  ingredients: [],
};

describe("cart helpers", () => {
  it("adds a new item to the cart", () => {
    const cart = addItemToCart([], baseItem);

    expect(cart).toHaveLength(1);
    expect(cart[0]?.quantity).toBe(1);
  });

  it("increments quantity when the item already exists", () => {
    const nextCart = addItemToCart(
      [{ slug: "la-carbonera", name: "La Carbonera", price: 11, quantity: 1, notes: "" }],
      baseItem,
    );

    expect(nextCart[0]?.quantity).toBe(2);
  });

  it("removes an item when quantity becomes zero", () => {
    const nextCart = updateCartQuantity(
      [{ slug: "la-carbonera", name: "La Carbonera", price: 11, quantity: 1, notes: "" }],
      "la-carbonera",
      0,
    );

    expect(nextCart).toHaveLength(0);
  });

  it("calculates the cart subtotal", () => {
    const total = cartSubtotal([
      { slug: "la-carbonera", name: "La Carbonera", price: 11, quantity: 2, notes: "" },
      { slug: "papas-cascadas", name: "Papas Cascadas", price: 6, quantity: 1, notes: "" },
    ]);

    expect(total).toBe(28);
  });
});
