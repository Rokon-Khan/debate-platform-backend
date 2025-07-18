import express from "express";
import {
  deleteArgument,
  editArgument,
  listArguments,
  postArgument,
} from "../controllers/argumentController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/:debateId", authenticateJWT, postArgument);
router.get("/:debateId", listArguments);
router.put("/edit/:id", authenticateJWT, editArgument);
router.delete("/delete/:id", authenticateJWT, deleteArgument);

export default router;
