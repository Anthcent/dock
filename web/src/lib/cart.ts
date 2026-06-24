import type { CartItem, MenuItem } from "../types";

export function addItemToCart(cart: CartItem[], item: MenuItem) {
  const existing = cart.find((cartItem) => cartItem.slug === item.slug);

  if (!existing) {
    return [
      ...cart,
      {
        slug: item.slug,
        name: item.name,
        price: item.price,
        quantity: 1,
        notes: "",
      },
    ];
  }

  return cart.map((cartItem) =>
    cartItem.slug === item.slug ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
  );
}

export function updateCartQuantity(cart: CartItem[], slug: string, nextQuantity: number) {
  if (nextQuantity <= 0) {
    return cart.filter((item) => item.slug !== slug);
  }

  return cart.map((item) => (item.slug === slug ? { ...item, quantity: nextQuantity } : item));
}

export function updateCartNotes(cart: CartItem[], slug: string, notes: string) {
  return cart.map((item) => (item.slug === slug ? { ...item, notes } : item));
}

export function cartSubtotal(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
