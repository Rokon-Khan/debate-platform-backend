import express from "express";
import { login, register } from "../controllers/authControllers";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
