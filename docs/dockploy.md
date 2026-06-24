# Despliegue en Dockploy

## Opcion 1: un solo servicio con Docker Compose

La manera mas simple para empezar en tu VPS es usar el repo completo y apuntar Dockploy al `docker-compose.yml`.

### Variables recomendadas

- `PORT=5050`
- `MONGO_URI=mongodb://mongo:27017/brasa-barrio`
- `WHATSAPP_PHONE=584120000000`
- `CORS_ORIGIN=https://tu-dominio-web.com`
- `VITE_API_URL=https://tu-dominio-api.com/api`

## Opcion 2: tres servicios separados

Si quieres aprender mejor Dockploy, crea:

1. `mongo`
2. `api`
3. `web`

### Mongo

- Imagen: `mongo:7`
- Puerto interno: `27017`
- Volumen persistente: `/data/db`

### API

- Dockerfile: `api/Dockerfile`
- Puerto interno: `5050`
- Variables:
  - `PORT`
  - `MONGO_URI`
  - `WHATSAPP_PHONE`
  - `CORS_ORIGIN`

### Web

- Dockerfile: `web/Dockerfile`
- Puerto interno: `4173`
- Build arg:
  - `VITE_API_URL`

## Orden recomendado para aprender en la VPS

1. Subir solo `mongo` y `api`
2. Probar `GET /api/health`
3. Probar `GET /api/menu`
4. Probar `POST /api/orders`
5. Subir `web`
6. Probar el flujo completo desde navegador

## Checklist rapido

- El dominio del frontend debe apuntar al contenedor `web`
- El dominio o subdominio del API debe apuntar al contenedor `api`
- `CORS_ORIGIN` debe incluir la URL real del frontend
- Mongo debe tener volumen persistente
- Cambia `WHATSAPP_PHONE` por el numero real del negocio
