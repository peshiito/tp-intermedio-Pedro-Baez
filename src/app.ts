import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import mascotasRoutes from "./routes/mascotas.routes";
import historialesRoutes from "./routes/historiales.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.use("/api/historiales", historialesRoutes);

// Ruta raíz con documentación
app.get("/", (_req, res) => {
  res.json({
    message: "API Patitas Felices 🐾 - Sistema de Gestión Veterinaria",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register (solo CLIENTE)",
        login: "POST /api/auth/login",
      },
      admin: {
        crear_usuario: "POST /api/admin/usuarios (solo ADMIN)",
        listar_usuarios: "GET /api/admin/usuarios (solo ADMIN)",
      },
      mascotas: {
        listar: "GET /api/mascotas",
        crear: "POST /api/mascotas (solo CLIENTE)",
        dar_baja: "DELETE /api/mascotas/:id",
      },
      historiales: {
        crear: "POST /api/historiales (solo VETERINARIO)",
        ver_por_mascota: "GET /api/historiales/mascota/:mascotaId",
      },
    },
    roles: {
      1: "ADMIN",
      2: "VETERINARIO",
      3: "CLIENTE",
    },
  });
});

// Middleware de errores
app.use(errorHandler);

export default app;
