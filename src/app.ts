import express from "express";
import argumentRoutes from "./app/routes/argument";
import authRoutes from "./app/routes/auth";
import debateRoutes from "./app/routes/debate";
import scoreboardRoutes from "./app/routes/scoreboard";
import voteRoutes from "./app/routes/vote";
const cors = require("cors");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/debates", debateRoutes);
app.use("/api/arguments", argumentRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/scoreboard", scoreboardRoutes);

// Error handler fallback
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err.message || err,
    });
  }
);

export default app;
