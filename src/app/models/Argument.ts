import mongoose, { Document, Schema, Types } from "mongoose";

export interface IArgument extends Document {
  debate: Types.ObjectId;
  author: Types.ObjectId;
  side: "support" | "oppose";
  content: string;
  votes: Types.ObjectId[]; // users who voted
  createdAt: Date;
  updatedAt: Date;
}

const ArgumentSchema: Schema = new Schema(
  {
    debate: { type: Schema.Types.ObjectId, ref: "Debate", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    side: { type: String, enum: ["support", "oppose"], required: true },
    content: { type: String, required: true },
    votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IArgument>("Argument", ArgumentSchema);
