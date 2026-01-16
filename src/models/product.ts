import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  images: string[];
  weight: string;
  description?: string;
  reviews?: number;
  type: string;
}

const ProductSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    weight: { type: String, required: true },
    description: { type: String },
    reviews: { type: Number },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
