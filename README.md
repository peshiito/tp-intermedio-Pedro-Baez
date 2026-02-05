# 🐾 Patitas Felices — TP Intermedio Backend

Backend desarrollado en **Node.js + TypeScript** con **Express, MySQL y JWT**, siguiendo una arquitectura modular basada en **MVC**. Incluye un dashboard protegido con **Handlebars** y autenticación por token.

---

## ✅ Estado del proyecto (alcance cumplido)

### 🔐 Autenticación

- Registro de usuarios con **bcryptjs (salt 10)**
- Login con emisión de **JWT (expira en 1 hora)**
- Rutas protegidas con middleware de verificación de token

### 🐶 Entidad protegida: Mascotas

El usuario autenticado puede:

- Registrar una mascota
- Listar sus propias mascotas
- Ver el historial clínico de una mascota (solo lectura)

> ⚠️ **Nota de alcance del TP:**  
> Solo se implementaron **CREATE y READ** vía API (probado con `curl`).  
> `PATCH` y `DELETE` quedaron **fuera del alcance** de este trabajo práctico.

---

## 📦 Requisitos previos

- Node.js **18+**
- npm **9+**
- Docker y Docker Compose (recomendado para MySQL)

---

## 📚 Dependencias principales del proyecto

Este backend usa:

- **express** → framework web
- **mysql2/promise** → conexión con MySQL
- **jsonwebtoken (JWT)** → autenticación por tokens
- **bcryptjs** → hash de contraseñas
- **express-validator** → validaciones
- **cors** → permitir peticiones desde frontend
- **express-handlebars** → vistas del dashboard
- **dotenv** → variables de entorno
- **typescript + ts-node-dev** → desarrollo en TypeScript

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/peshiito/tp-intermedio-Pedro-Baez.git
cd tp-intermedio-Pedro-Baez
```

### 2️⃣ Instalar dependencias (MUY IMPORTANTE)

Ejecutar:

```bash
npm install
```

Si querés ver qué paquetes instala, el proyecto incluye (en package.json):

```bash
npm install express mysql2 jsonwebtoken bcryptjs cors dotenv express-validator express-handlebars
npm install -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken @types/bcryptjs
```

> ⚠️ Si algo falla:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### 3️⃣ Variables de entorno

Crear archivo `.env` en la raíz:

```env
PORT=3000
JWT_SECRET=supersecreto_cambia_esto

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=appuser
DB_PASSWORD=apppassword
DB_NAME=patitas_felices
```

> También existe `.env.example` como referencia.

---

## 🐳 4️⃣ Base de datos con Docker (recomendado)

```bash
docker compose up -d
```

Servicios:

- MySQL: `localhost:3306` → `appuser / apppassword`
- phpMyAdmin: `http://localhost:8080` (host: `mysql`)

---

## 🗄️ 5️⃣ Crear tablas

Importar `init.sql` desde phpMyAdmin o CLI.  
Crea: usuarios, mascotas, veterinarios e historiales clínicos.

---

## ▶️ 6️⃣ Ejecutar el servidor

```bash
npm run dev
```

### Producción (opcional)

```bash
npm run build
npm start
```

---

## 🏗️ Arquitectura del proyecto (MVC)

```
src/
│── index.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── admin.controller.ts
│   └── mascotas.controller.ts
├── routes/
│   ├── auth.routes.ts
│   ├── admin.routes.ts
│   └── mascotas.routes.ts
├── services/
│   └── auth.service.ts
├── models/
│   └── user.model.ts
├── database/
│   └── mysql.ts
├── middlewares/
│   └── auth.middleware.ts
├── validators/
│   ├── auth.validator.ts
│   └── mascota.validator.ts
└── views/
    ├── layouts/main.hbs
    └── dashboard.hbs
```

---

## 🔌 Endpoints y ejemplos con `curl`

### 🔓 Autenticación

**Registro**

```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "nombre": "Pedro",
  "apellido": "Baez",
  "email": "pedro@mail.com",
  "password": "Password123!",
  "telefono": "1155648450",
  "direccion": "13 de diciembre 1820"
}'
```

**Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"pedro@mail.com","password":"Password123!"}'
```

---

### 🔐 Mascotas (requiere Bearer Token)

**Listar mascotas**

```bash
curl -H "Authorization: Bearer TU_TOKEN" \
http://localhost:3000/api/mascotas
```

**Crear mascota**

```bash
curl -X POST http://localhost:3000/api/mascotas \
-H "Authorization: Bearer TU_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "nombre": "Firulais",
  "especie": "Perro",
  "fecha_nacimiento": "2020-05-15"
}'
```

**Ver historial clínico**

```bash
curl -H "Authorization: Bearer TU_TOKEN" \
http://localhost:3000/api/mascotas/ID_MASCOTA/historial
```

---

## 🖥️ Dashboard protegido

```bash
curl -H "Authorization: Bearer TU_TOKEN" \
http://localhost:3000/dashboard
```

---

## 🔐 Seguridad

- Validaciones con express-validator
- Hash bcrypt (salt 10)
- JWT con expiración 1h
- Middleware `verifyToken`
- Middleware `adminMiddleware`

---

## 📌 Scripts

```bash
npm run dev
npm run build
npm start
```

---

## 🗺️ Roadmap (pendientes)

- PATCH/DELETE de mascotas
- Middleware global de errores
- Tests
- Seeder de datos
- Swagger/OpenAPI

---

## 📝 Nota admin manual (MySQL)

```sql
INSERT INTO usuarios
(nombre, apellido, email, password, telefono, direccion, rol_id)
VALUES
('Admin', 'Sistema', 'admin@patitas.com', 'REEMPLAZAR_CON_HASH_BCRYPT', '000', 'Sistema', 1);
```

---

## 📄 Licencia

ISC
