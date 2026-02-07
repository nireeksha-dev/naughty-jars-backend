import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  images: string[];
  thumbnail?: string; // Optional thumbnail image
  weight: string;
  description?: string;
  reviews?: number;
  type: string;
  category?: string;
  stock: number;
  isFeatured: boolean;
  tags: string[];
}

const ProductSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true, default: [] },
    thumbnail: { type: String }, // Optional separate thumbnail
    weight: { type: String, required: true },
    description: { type: String },
    reviews: { type: Number, default: 0 },
    type: { type: String, required: true },
    category: { type: String },
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

// Indexes for better query performance
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ type: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1 });

export default mongoose.model<IProduct>("Product", ProductSchema);