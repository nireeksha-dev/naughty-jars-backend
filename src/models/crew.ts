import mongoose, { Schema, Document } from "mongoose";

export interface ICrew extends Document {
  name: string;
  position: string;
  contact: string;
  email: string;
}

const CrewSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICrew>("Crew", CrewSchema);
