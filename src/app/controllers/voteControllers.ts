import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Argument from "../models/Argument";
import Debate from "../models/Debate";
import User from "../models/User";

export const voteArgument = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const arg = await Argument.findById(id);
  if (!arg) return res.status(404).json({ message: "Argument not found" });

  const debate = await Debate.findById(arg.debate);
  if (!debate || debate.closed || new Date() > debate.endsAt)
    return res.status(403).json({ message: "Voting closed" });

  if (arg.author.toString() === req.user!._id.toString())
    return res.status(400).json({ message: "Cannot vote for own argument" });

  if (arg.votes.includes(req.user!._id))
    return res.status(400).json({ message: "Already voted" });

  arg.votes.push(req.user!._id);
  await arg.save();

  await User.findByIdAndUpdate(arg.author, { $inc: { totalVotes: 1 } });

  res.json({ message: "Voted", votes: arg.votes.length });
};
