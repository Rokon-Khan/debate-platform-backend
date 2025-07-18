import mongoose, { Document, Schema, Types } from "mongoose";

export type Side = "support" | "oppose";

export interface IDebate extends Document {
  title: string;
  description: string;
  tags: string[];
  category: string;
  image: string;
  duration: number; // in ms
  createdBy: Types.ObjectId;
  participants: {
    user: Types.ObjectId;
    side: Side;
    joinedAt: Date;
    firstArgumentAt?: Date;
  }[];
  endsAt: Date;
  closed: boolean;
  winner: Side | null;
}

const DebateSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
    image: { type: String },
    duration: { type: Number, required: true }, // ms
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        side: { type: String, enum: ["support", "oppose"], required: true },
        joinedAt: { type: Date, default: Date.now },
        firstArgumentAt: { type: Date },
      },
    ],
    endsAt: { type: Date, required: true },
    closed: { type: Boolean, default: false },
    winner: { type: String, enum: ["support", "oppose", null], default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IDebate>("Debate", DebateSchema);
