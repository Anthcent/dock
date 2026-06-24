import { menuFallback } from "../data/menuFallback";
import type { CartItem, MenuResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5050/api";

export async function fetchMenu(): Promise<MenuResponse> {
  try {
    const response = await fetch(`${API_URL}/menu`);

    if (!response.ok) {
      throw new Error("No se pudo cargar el menu");
    }

    return (await response.json()) as MenuResponse;
  } catch {
    return menuFallback;
  }
}

export async function submitOrder(payload: {
  customerName: string;
  phone: string;
  fulfillmentType: "pickup" | "delivery";
  address: string;
  paymentMethod: string;
  requestedTime: string;
  notes: string;
  items: CartItem[];
}) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el pedido");
  }

  return response.json() as Promise<{
    orderCode: string;
    subtotal: number;
    whatsappMessage: string;
    whatsappUrl: string;
  }>;
}
