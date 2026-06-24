import { z } from "zod";
import { OrderModel } from "../models/Order.js";

const orderInputSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(7),
  fulfillmentType: z.enum(["pickup", "delivery"]),
  address: z.string().optional().default(""),
  paymentMethod: z.string().min(2),
  requestedTime: z.string().min(2),
  notes: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        slug: z.string(),
        name: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        notes: z.string().optional().default(""),
      }),
    )
    .min(1),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export function buildWhatsappMessage(order: OrderInput, orderCode: string) {
  const lines = [
    `Hola Brasa de Barrio, quiero confirmar mi pedido ${orderCode}:`,
    "",
    ...order.items.map(
      (item) =>
        `- ${item.quantity}x ${item.name} ($${item.price * item.quantity})${item.notes ? ` | Nota: ${item.notes}` : ""}`,
    ),
    "",
    `Cliente: ${order.customerName}`,
    `Telefono: ${order.phone}`,
    `Entrega: ${order.fulfillmentType === "pickup" ? "Retiro en local" : "Delivery"}`,
    `Hora: ${order.requestedTime}`,
    `Pago: ${order.paymentMethod}`,
    `Direccion: ${order.address || "No aplica"}`,
    `Notas: ${order.notes || "Sin notas"}`,
    `Total: $${calculateSubtotal(order.items).toFixed(2)}`,
  ];

  return lines.join("\n");
}

export function calculateSubtotal(items: OrderInput["items"]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function generateOrderCode() {
  return `BB-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function createOrder(input: OrderInput) {
  const order = orderInputSchema.parse(input);
  const orderCode = generateOrderCode();
  const subtotal = calculateSubtotal(order.items);
  const whatsappMessage = buildWhatsappMessage(order, orderCode);

  const created = await OrderModel.create({
    ...order,
    orderCode,
    subtotal,
    whatsappMessage,
  });

  return {
    orderCode: created.orderCode,
    subtotal: created.subtotal,
    whatsappMessage: created.whatsappMessage,
  };
}
