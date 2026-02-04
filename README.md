# Holaaaaa Este es m repo de proyecto Backend intermedio

## Para crear un usuario desde terminal :

```
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{
"nombre": "Pedro",
"apellido": "Baez",
"email": "pedro@mail.com",
"password": "Password123!",
"telefono": "1155648450",
"direccion": "13 de diciembre 1820"
}'
```

## Registrar usuario admin en MYSQL :

```
INSERT INTO usuarios
(nombre, apellido, email, password, telefono, direccion, rol_id)
VALUES
(
  'Admin',
  'Sistema',
  'admin@patitas.com',
  '$2a$10$HASH_AQUI',
  '000000000',
  'Sistema',
  1
);
```

## Iniciar sesion de Usuario ya registrado :

```
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pedro@mail.com","password":"Password123!"}'
```

## Validaciones de Autenticación

El sistema ahora incluye validaciones robustas para registro y login:

### Validaciones de Registro:

- **Email**: Debe ser un email válido y único.
- **Nombre**: Mínimo 2 caracteres.
- **Apellido**: Opcional, mínimo 2 caracteres si se proporciona.
- **Contraseña**: Mínimo 8 caracteres, debe contener al menos un número, una mayúscula y un carácter especial.

### Validaciones de Login:

- **Email**: Debe ser un email válido.
- **Contraseña**: Campo requerido.

Si las validaciones fallan, el servidor devolverá un JSON con los errores específicos.

### Pasos completos para iniciar sesión y acceder al dashboard:

1. **Asegúrate de que el servidor esté corriendo**: Ejecuta `npm run dev` en una terminal.
2. **Registra un usuario** (si no tienes uno): Usa el comando de arriba para `/api/auth/register`.
3. **Inicia sesión**: Ejecuta el comando de login. Si es exitoso, obtendrás un JSON con `"token"`.
4. **Copia el token** (sin comillas) del response.
5. **Accede al dashboard con el token**:
   ```
   curl -H "Authorization: Bearer TU_TOKEN_AQUI" http://localhost:3000/dashboard
   ```
   Esto devolverá el HTML del dashboard con un mensaje de bienvenida personalizado y estilos bonitos (ej. "Hola, Pedro!" con colores).

### Para ver el dashboard en el navegador:

- Instala una extensión como "ModHeader" en Chrome/Firefox.
- Configúrala para agregar el header `Authorization: Bearer TU_TOKEN`.
- Abre `http://localhost:3000/dashboard` en el navegador.

## APIs de Mascotas

Una vez logueado, puedes gestionar tus mascotas. Todas las rutas requieren el header `Authorization: Bearer TU_TOKEN`.

### Registrar una nueva mascota:

```
curl -X POST http://localhost:3000/api/mascotas \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Firulais",
    "especie": "Perro",
    "fecha_nacimiento": "2020-05-15"
  }'
```

### Ver tus mascotas:

```
curl -H "Authorization: Bearer TU_TOKEN" http://localhost:3000/api/mascotas
```

### Ver historial clínico de una mascota:

```
curl -H "Authorization: Bearer TU_TOKEN" http://localhost:3000/api/mascotas/ID_MASCOTA/historial
```

# TITULO NUMERO 3

## Estructura de Carpetas src

```
src/
├── index.ts
├── controllers/
│   ├── admin.controller.ts
│   ├── auth.controller.ts
│   └── mascotas.controller.ts
├── database/
│   └── mysql.ts
├── middlewares/
│   └── auth.middleware.ts
├── models/
│   └── user.model.ts
├── routes/
│   ├── admin.routes.ts
│   ├── auth.routes.ts
│   └── mascotas.routes.ts
├── services/
│   └── auth.service.ts
├── types/
│   ├── auth.ts
│   ├── express.d.ts
│   └── IUser.ts
├── validators/
│   └── auth.validator.ts
├── views/
│   ├── dashboard.hbs
│   └── layouts/
│       └── main.hbs
```

## Códigos de los Archivos

### src/index.ts

```typescript
import express, { Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { engine } from "express-handlebars";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import mascotasRoutes from "./routes/mascotas.routes";
import { verifyToken } from "./middlewares/auth.middleware";
import { JwtPayload } from "./types/auth";

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
app.get(
  "/dashboard",
  verifyToken,
  (req: Request & { user?: JwtPayload }, res) => {
    const rolNombre = req.user!.rol_id === 1 ? "admin" : "user";
    res.render("dashboard", {
      nombre: req.user!.nombre,
      rol: rolNombre,
    });
  },
);

// Root simple
app.get("/", (_req, res) => {
  res.send("API Patitas Felices funcionando 🐾");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
```

### src/controllers/admin.controller.ts

```typescript
import { Request, Response } from "express";
import pool from "../database/mysql";

export const getUsuarios = async (_req: Request, res: Response) => {
  const [usuarios] = await pool.query(
    "SELECT id, nombre, apellido, email, rol_id FROM usuarios",
  );

  res.json(usuarios);
};
```

### src/controllers/auth.controller.ts

```typescript
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, apellido, email, password, telefono, direccion } = req.body;
    await authService.registerUser(
      nombre,
      apellido,
      email,
      password,
      telefono,
      direccion,
    );

    res.status(201).json({
      message: "Usuario creado correctamente",
    });
  } catch (error: any) {
    console.error("Error en register:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya existe" });
    }
    return res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);

    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error: any) {
    if (error.message === "Credenciales inválidas") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
```

### src/controllers/mascotas.controller.ts

```typescript
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../database/mysql";
import { JwtPayload } from "../types/auth";

export const createMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { nombre, especie, fecha_nacimiento } = req.body;
    const usuarioId = req.user.id;

    const [result]: any = await pool.query(
      `INSERT INTO mascotas (nombre, especie, fecha_nacimiento, usuario_id)
       VALUES (?, ?, ?, ?)`,
      [nombre, especie, fecha_nacimiento, usuarioId],
    );

    res.status(201).json({
      message: "Mascota registrada",
      mascotaId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear mascota" });
  }
};

export const getMascotas = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const usuarioId = req.user.id;

    const [mascotas] = await pool.query(
      "SELECT id, nombre, especie, fecha_nacimiento, created_at FROM mascotas WHERE usuario_id = ?",
      [usuarioId],
    );

    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mascotas" });
  }
};

export const getHistorialMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la mascota pertenece al usuario
    const [mascota]: any = await pool.query(
      "SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?",
      [id, usuarioId],
    );

    if (mascota.length === 0) {
      return res
        .status(404)
        .json({ message: "Mascota no encontrada o no autorizada" });
    }

    const [historiales] = await pool.query(
      `SELECT h.id, h.descripcion, h.fecha_registro, v.nombre as veterinario_nombre, v.apellido as veterinario_apellido, v.matricula
       FROM historiales_clinicos h
       JOIN veterinarios v ON h.id_veterinario = v.id
       WHERE h.id_mascota = ?
       ORDER BY h.fecha_registro DESC`,
      [id],
    );

    res.json(historiales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial" });
  }
};
```

### src/database/mysql.ts

```typescript
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
```

### src/middlewares/auth.middleware.ts

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Middleware de autenticación
 *
 * Verifica que el token sea válido y lo almacena en req.user
 */
export const verifyToken = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token or expired" });
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

/**
 * Middleware de autorización
 *
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export const adminMiddleware = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.rol_id !== 1) {
    return res
      .status(403)
      .json({ message: "Acceso solo para administradores" });
  }
  next();
};
```

### src/models/user.model.ts

```typescript
import pool from "../database/mysql";
import { RowDataPacket } from "mysql2";
import { IUser } from "../types/IUser";

export type UserRow = IUser & RowDataPacket;

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
    [email],
  );

  return rows.length ? rows[0] : null;
};

export const createUser = async (user: Omit<IUser, "id">): Promise<number> => {
  const [userResult] = await pool.query(
    "INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      user.nombre,
      user.apellido,
      user.email,
      user.password,
      user.telefono,
      user.direccion,
      user.rol_id,
    ],
  );

  return (userResult as any).insertId;
};
```

### src/routes/admin.routes.ts

```typescript
import { Router } from "express";
import { getUsuarios } from "../controllers/admin.controller";
import { verifyToken, adminMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/usuarios", verifyToken, adminMiddleware, getUsuarios);

export default router;
```

### src/routes/auth.routes.ts

```typescript
import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);

export default router;
```

### src/routes/mascotas.routes.ts

```typescript
import { Router } from "express";
import {
  createMascota,
  getMascotas,
  getHistorialMascota,
} from "../controllers/mascotas.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { createMascotaValidator } from "../validators/mascota.validator";

const router = Router();

router.post("/", verifyToken, createMascotaValidator, createMascota);
router.get("/", verifyToken, getMascotas);
router.get("/:id/historial", verifyToken, getHistorialMascota);

export default router;
```

### src/services/auth.service.ts

```typescript
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/user.model";
import { JwtPayload } from "../types/auth";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}

const secretKey: string = process.env.JWT_SECRET;

export const registerUser = async (
  nombre: string,
  apellido: string,
  email: string,
  password: string,
  telefono?: string,
  direccion?: string,
): Promise<number> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await createUser({
    nombre,
    apellido,
    email,
    password: hashedPassword,
    telefono,
    direccion,
    rol_id: 2, // USER por defecto
  });

  return userId;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<string> => {
  const invalidCredentialsError = new Error("Credenciales inválidas");

  const user = await findUserByEmail(email);
  if (!user) throw invalidCredentialsError;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw invalidCredentialsError;

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol_id: user.rol_id,
  };

  const options: SignOptions = {
    expiresIn: "1h",
    issuer: "patitas-felices",
  };

  return jwt.sign(payload, secretKey, options);
};
```

### src/types/auth.ts

```typescript
export interface JwtPayload {
  //jsonwebtoken Payload personalizado
  id: number;
  email: string;
  nombre: string;
  rol_id: number;
}

export enum UserRole {
  USER = 2,
  ADMIN = 1,
}
```

### src/types/express.d.ts

```typescript
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
    }
  }
}
```

### src/types/IUser.ts

```typescript
import { UserRole } from "./auth";

export interface IUser {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  rol_id: UserRole;
}
```

### src/validators/auth.validator.ts

```typescript
import { body } from "express-validator";
import { ValidationChain } from "express-validator";

export const validatePassword: ValidationChain[] = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una mayúscula")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("La contraseña debe contener al menos un carácter especial"),
];

export const validateEmail: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
];

export const registerValidator: ValidationChain[] = [
  ...validateEmail,
  ...validatePassword,
  body("nombre")
    .isLength({ min: 2 })
    .withMessage("Nombre debe tener al menos 2 caracteres"),
  body("apellido")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Apellido debe tener al menos 2 caracteres"),
];

export const loginValidator: ValidationChain[] = [
  ...validateEmail,
  body("password").notEmpty().withMessage("La contraseña es requerida"),
];
```

### src/validators/mascota.validator.ts

```typescript
import { body } from "express-validator";
import { ValidationChain } from "express-validator";

export const createMascotaValidator: ValidationChain[] = [
  body("nombre")
    .isLength({ min: 1 })
    .withMessage("Nombre de la mascota es requerido"),
  body("especie").isLength({ min: 1 }).withMessage("Especie es requerida"),
  body("fecha_nacimiento")
    .optional()
    .isISO8601()
    .withMessage("Fecha de nacimiento debe ser una fecha válida"),
];
```

### src/views/dashboard.hbs

```handlebars
<h1>🐾 Bienvenido a Patitas Felices</h1>

<h2>Hola, {{nombre}}!</h2>

{{#if (eq rol "admin")}}
  <div class="admin">
    <p>👑 Eres Administrador</p>
    <p>Tienes acceso completo al sistema. Puedes gestionar usuarios y todo lo
      demás.</p>
  </div>
{{else}}
  <div class="user">
    <p>🙋 Eres Usuario</p>
    <p>Puedes gestionar tus mascotas y ver sus historiales clínicos.</p>
  </div>
{{/if}}

<p>¡Disfruta usando la plataforma!</p>
```

### src/views/layouts/main.hbs

```handlebars
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>🐾 Patitas Felices - Dashboard</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 20px;
        text-align: center;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #4caf50;
      }
      h2 {
        color: #2196f3;
      }
      p {
        font-size: 18px;
      }
      .admin {
        background-color: #fff3cd;
        padding: 10px;
        border-radius: 4px;
      }
      .user {
        background-color: #d1ecf1;
        padding: 10px;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      {{{body}}}
    </div>
  </body>
</html>
```
