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
