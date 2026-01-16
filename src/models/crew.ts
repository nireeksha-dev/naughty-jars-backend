import mongoose, { Schema, Document } from "mongoose";

export interface ICrew extends Document {
  name: string;
  position: string;
  contact: string;
  email: string;
  status: "active" | "on-leave" | "inactive";
}

const CrewSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["active", "on-leave", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICrew>("Crew", CrewSchema);
