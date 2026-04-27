import mongoose, { Schema, Document } from "mongoose";

// --- TypeScript Interface ---
export interface IData extends Document {
  name: string;
  value: string;
  synced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dataSchema = new mongoose.Schema(
  {
    name: String,
    value: String,

    synced: { type: Boolean, default: false }, // 🔥 important
  },
  {
    timestamps: true,
  },
);

export const Data = mongoose.model("Data", dataSchema);
