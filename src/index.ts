import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../src/database/mysql";

dotenv.config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();
