import { Schema, model, type InferSchemaType } from "mongoose";

const orderItemSchema = new Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    notes: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    fulfillmentType: { type: String, enum: ["pickup", "delivery"], required: true },
    address: { type: String, default: "" },
    paymentMethod: { type: String, required: true },
    requestedTime: { type: String, default: "lo antes posible" },
    notes: { type: String, default: "" },
    subtotal: { type: Number, required: true },
    items: { type: [orderItemSchema], default: [] },
    whatsappMessage: { type: String, required: true },
    status: { type: String, default: "pending_whatsapp" },
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;

export const OrderModel = model("Order", orderSchema);
