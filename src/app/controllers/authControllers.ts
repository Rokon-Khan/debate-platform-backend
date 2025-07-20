import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists)
    return res.status(409).json({ message: "User or email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();

  return res.status(201).json({ message: "Registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return res.status(200).json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

export const googleAuth = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Missing email, username, or password" });
  }

  let user = await User.findOne({ email });
  if (!user) {
    // Only create user if this email does not exist
    user = new User({
      username,
      email,
      password, // Will be a random password, never shown to user
    });
    await user.save();
  }
  // Issue JWT if desired, or just return user
  res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },

    // token,
  });
};
