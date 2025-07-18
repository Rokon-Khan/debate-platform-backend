import express from "express";
import { voteArgument } from "../controllers/voteControllers";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// POST /api/votes/:id
router.post("/:id", authenticateJWT, voteArgument);

export default router;
