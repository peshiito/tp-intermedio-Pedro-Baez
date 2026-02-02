import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Rutas
import authRoutes from "./routes/auth.routes";
import mascotasRoutes from "./routes/mascotas.routes";
import adminRoutes from "./routes/admin.routes";

// Config
dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta base (health check)
app.get("/", (_req, res) => {
  res.json({
    message: "API Patitas Felices funcionando 🐾",
    status: "OK",
  });
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.use("/api/admin", adminRoutes);

// Middleware de errores global (simple)
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  },
);

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🐾 Servidor Patitas Felices corriendo en puerto ${PORT}`);
  console.log(`Puerto para entrar http://localhost:${PORT}`);
});
