import express from "express";
import {
  createDebate,
  getDebate,
  joinDebate,
  listDebates,
} from "../controllers/debateControllers";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateJWT, createDebate);
router.post("/:id/join", authenticateJWT, joinDebate);
router.get("/:id", getDebate);
router.get("/", listDebates);

export default router;
