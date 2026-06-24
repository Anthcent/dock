import { Schema, model, type InferSchemaType } from "mongoose";

const menuItemSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    heat: { type: String, required: true },
    featured: { type: Boolean, default: false },
    image: { type: String, required: true },
    accent: { type: String, required: true },
    ingredients: { type: [String], default: [] },
  },
  { timestamps: true },
);

export type MenuItemDocument = InferSchemaType<typeof menuItemSchema>;

export const MenuItemModel = model("MenuItem", menuItemSchema);
