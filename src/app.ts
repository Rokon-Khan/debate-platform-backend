import express from "express";
const cors = require("cors");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use CORS with the specified options

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
