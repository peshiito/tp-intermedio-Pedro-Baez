import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import mascotasRoutes from "./routes/mascotas.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/mascotas", mascotasRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "API Patitas Felices funcionando 🐾" });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
