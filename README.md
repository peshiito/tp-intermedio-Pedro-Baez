# Holaaaaa Este es m repo de proyecto Backend intermedio

## Para crear un usuario desde terminal :

```
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{
"nombre": "Pedro",
"apellido": "Baez",
"email": "pedro@mail.com",
"password": "123456",
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
  -d '{"email":"pedro@mail.com","password":"123456"}'
```

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
