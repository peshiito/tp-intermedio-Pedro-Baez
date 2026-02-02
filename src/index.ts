import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { engine } from "express-handlebars";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import mascotasRoutes from "./routes/mascotas.routes";
import { verifyToken } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      eq: (a: any, b: any) => a === b,
    },
  }),
);
app.set("view engine", "hbs");
app.set("views", "./src/views");

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mascotas", mascotasRoutes);

// Ruta visual protegida
app.get("/dashboard", verifyToken, (req: any, res) => {
  const rolNombre = req.user.rol_id === 1 ? "admin" : "user";
  res.render("dashboard", {
    nombre: req.user.nombre,
    rol: rolNombre,
  });
});

// Root simple
app.get("/", (_req, res) => {
  res.send("API Patitas Felices funcionando 🐾");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
