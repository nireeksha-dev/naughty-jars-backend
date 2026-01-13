import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  content: string;
  rating: number;
  date: Date;
}

const TestimonialSchema: Schema<ITestimonial> = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

TestimonialSchema.index({ rating: -1, createdAt: -1 });

export default mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);