import { Request, Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/auth";
import Debate from "../models/Debate";
import User from "../models/User";

export const createDebate = async (req: AuthRequest, res: Response) => {
  const { title, description, tags, category, image, duration } = req.body;
  if (!title || !description || !category || !duration)
    return res.status(400).json({ message: "Missing fields" });

  const endsAt = new Date(Date.now() + Number(duration));
  const debate = await Debate.create({
    title,
    description,
    tags,
    category,
    image,
    duration: Number(duration),
    createdBy: req.user!._id,
    endsAt,
  });
  return res.status(201).json(debate);
};

export const joinDebate = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { side } = req.body;
  if (!["support", "oppose"].includes(side))
    return res.status(400).json({ message: "Invalid side" });

  const debate = await Debate.findById(id);
  if (!debate) return res.status(404).json({ message: "Debate not found" });
  if (debate.closed || new Date() > debate.endsAt)
    return res.status(403).json({ message: "Debate closed" });

  const already = debate.participants.find(
    (p) => p.user.toString() === req.user!._id.toString()
  );
  if (already)
    return res
      .status(400)
      .json({ message: "Already joined, cannot switch sides" });

  debate.participants.push({
    user: new Types.ObjectId(req.user!._id),
    side,
    joinedAt: new Date(),
  });

  await debate.save();
  await User.findByIdAndUpdate(req.user!._id, {
    $inc: { debatesParticipated: 1 },
  });
  return res.status(200).json({ message: "Joined debate", debate });
};

export const getDebate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const debate = await Debate.findById(id)
    .populate("createdBy", "username")
    .lean();
  if (!debate) return res.status(404).json({ message: "Not found" });
  return res.json(debate);
};

export const listDebates = async (req: Request, res: Response) => {
  // Filtering, search, and sort can be implemented here.
  const debates = await Debate.find().sort({ createdAt: -1 }).lean();
  return res.json(debates);
};
