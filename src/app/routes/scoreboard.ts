import express from "express";
import { getScoreboard } from "../controllers/scoreboardControllers";

const router = express.Router();

router.get("/", getScoreboard);

export default router;
