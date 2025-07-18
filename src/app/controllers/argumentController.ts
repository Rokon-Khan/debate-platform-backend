import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Argument from "../models/Argument";
import Debate from "../models/Debate";
import { containsBannedWords } from "../utils/bannedWords";

export const postArgument = async (req: AuthRequest, res: Response) => {
  const { debateId } = req.params;
  const { content } = req.body;

  const debate = await Debate.findById(debateId);
  if (!debate) return res.status(404).json({ message: "Debate not found" });
  if (debate.closed || new Date() > debate.endsAt)
    return res.status(403).json({ message: "Debate closed" });

  const participant = debate.participants.find(
    (p) => p.user.toString() === req.user!._id.toString()
  );
  if (!participant)
    return res
      .status(403)
      .json({ message: "Must join debate before posting arguments" });

  if (containsBannedWords(content))
    return res.status(400).json({ message: "Argument contains banned words" });

  const side = participant.side;
  const arg = await Argument.create({
    debate: debateId,
    author: req.user!._id,
    side,
    content,
    votes: [],
  });

  // For reply timer bonus: set firstArgumentAt if not already
  if (!participant.firstArgumentAt) {
    participant.firstArgumentAt = new Date();
    await debate.save();
  }

  return res.status(201).json(arg);
};

export const listArguments = async (req: AuthRequest, res: Response) => {
  const { debateId } = req.params;
  const argumentsList = await Argument.find({ debate: debateId })
    .populate("author", "username")
    .sort({ createdAt: 1 })
    .lean();
  return res.json(argumentsList);
};

export const editArgument = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  const arg = await Argument.findById(id);
  if (!arg) return res.status(404).json({ message: "Not found" });
  if (arg.author.toString() !== req.user!._id.toString())
    return res.status(403).json({ message: "Forbidden" });

  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  if (now.getTime() - arg.createdAt.getTime() > fiveMinutes)
    return res
      .status(403)
      .json({ message: "Can only edit within 5 minutes of posting" });

  if (containsBannedWords(content))
    return res.status(400).json({ message: "Argument contains banned words" });

  arg.content = content;
  await arg.save();
  res.json(arg);
};

export const deleteArgument = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const arg = await Argument.findById(id);
  if (!arg) return res.status(404).json({ message: "Not found" });
  if (arg.author.toString() !== req.user!._id.toString())
    return res.status(403).json({ message: "Forbidden" });

  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  if (now.getTime() - arg.createdAt.getTime() > fiveMinutes)
    return res
      .status(403)
      .json({ message: "Can only delete within 5 minutes of posting" });

  await arg.deleteOne();
  res.json({ message: "Deleted" });
};
