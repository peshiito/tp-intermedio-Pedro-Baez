# TP Intermedio - Backend Patitas Felices

Servidor backend con **Express + TypeScript + MySQL + JWT** siguiendo arquitectura MVC.  
Incluye autenticación, rutas protegidas y una entidad privada **Mascotas** asociada al usuario autenticado.

## Requisitos

- Node.js 18+
- MySQL 8 (o Docker para levantarlo con `docker-compose`)

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Crear el archivo `.env` basado en `.env.example`.

3. Crear la base de datos e importar el schema:

```bash
mysql -u root -p < init.sql
```

> El archivo `init.sql` incluye la tabla `roles` con datos iniciales y la relación con `usuarios`.

4. Ejecutar en modo desarrollo:

```bash
npm run dev
```

## Scripts

- `npm run dev`: levanta el servidor en modo desarrollo.
- `npm run build`: compila TypeScript.
- `npm start`: ejecuta el build en `dist/`.

## Variables de entorno

Ver `.env.example` para los valores requeridos.

## Endpoints

### Auth (públicos)

#### POST /api/auth/register
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

#### POST /api/auth/login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pedro@mail.com","password":"Password123!"}'
```

#### POST /api/auth/veterinarios/login
```bash
curl -X POST http://localhost:3000/api/auth/veterinarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dr.juan@patitas.com","password":"TU_PASSWORD"}'
```

### Mascotas (privados, requieren token)

Todas las rutas deben incluir:
```
Authorization: Bearer TU_TOKEN
```

#### GET /api/mascotas
```bash
curl -H "Authorization: Bearer TU_TOKEN" http://localhost:3000/api/mascotas
```

#### POST /api/mascotas
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

#### PATCH /api/mascotas/:id
```bash
curl -X PATCH http://localhost:3000/api/mascotas/1 \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Firulais Jr."
  }'
```

#### DELETE /api/mascotas/:id
```bash
curl -X DELETE http://localhost:3000/api/mascotas/1 \
  -H "Authorization: Bearer TU_TOKEN"
```

#### GET /api/mascotas/:id/historial
```bash
curl -H "Authorization: Bearer TU_TOKEN" http://localhost:3000/api/mascotas/1/historial
```

### Historiales clínicos (privados)

Solo un veterinario autenticado puede crear historiales.  
La visualización del historial de una mascota está restringida al veterinario que lo creó y al dueño de la mascota.

#### POST /api/historiales
```bash
curl -X POST http://localhost:3000/api/historiales \
  -H "Authorization: Bearer TU_TOKEN_VETERINARIO" \
  -H "Content-Type: application/json" \
  -d '{
    "mascota_id": 1,
    "descripcion": "Chequeo general sin novedades."
  }'
```

## Colección de pruebas

Puedes importar los ejemplos de requests usando los comandos `curl` anteriores en Postman/Thunder Client.

## Configurar veterinarios

La tabla `veterinarios` ahora incluye `email` y `password`.  
Para crear un veterinario funcional, generá un hash bcrypt y reemplazá el valor de ejemplo `REEMPLAZAR_HASH` en `init.sql`:

```bash
node -e "console.log(require('bcryptjs').hashSync('TU_PASSWORD', 10))"
```

## Estructura del proyecto (MVC)

```
src/
├── controllers/
├── database/
├── middlewares/
├── models/
├── routes/
├── services/
├── types/
├── validators/
└── index.ts
```
