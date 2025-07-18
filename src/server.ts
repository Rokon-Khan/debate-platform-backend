import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
dotenv.config();

let server: Server;

const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwao6.mongodb.net/DebateArena?retryWrites=true&w=majority&appName=Cluster0`
    );

    console.log("Connected to MongoDB");

    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
