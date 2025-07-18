import { Request, Response } from "express";
import Argument from "../models/Argument";

export const getScoreboard = async (req: Request, res: Response) => {
  const { filter } = req.query; // 'weekly', 'monthly', 'all'
  let dateFilter = {};
  if (filter === "weekly") {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    dateFilter = { createdAt: { $gte: lastWeek } };
  } else if (filter === "monthly") {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    dateFilter = { createdAt: { $gte: lastMonth } };
  }

  // Aggregate votes for users within the filter
  const agg = await Argument.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$author",
        votes: { $sum: { $size: "$votes" } },
        debates: { $addToSet: "$debate" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        username: "$user.username",
        votes: 1,
        debates: { $size: "$debates" },
      },
    },
    { $sort: { votes: -1 } },
    { $limit: 100 },
  ]);

  res.json(agg);
};
