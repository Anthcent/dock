# Brasa de Barrio

Sistema MERN de menu y pedidos por WhatsApp para una hamburgueseria, pensado como primer proyecto real para practicar una VPS con Docker y luego llevarlo a Dockploy.

## Lo que incluye

- `web/`: React + Vite + TypeScript
- `api/`: Express + Mongoose + Zod
- `mongo`: base de datos via Docker Compose
- Carrito de compra y checkout
- Generacion de pedido por WhatsApp
- Persistencia de ordenes en MongoDB
- Seed inicial del menu
- Dockerfiles para `web` y `api`
- `docker-compose.yml` para levantar el stack completo

## Direccion visual

La interfaz evita el combo tipico rojo/amarillo y tambien evita el look generico de IA. La marca usa:

- tinta tostada
- verde encurtido
- crema de ticket
- tipografia de cartel pesado con cuerpo editorial

## Estructura

```text
.
|-- api
|   |-- src
|   |   |-- config
|   |   |-- data
|   |   |-- models
|   |   |-- routes
|   |   |-- scripts
|   |   `-- services
|-- docs
|-- web
|   `-- src
|-- docker-compose.yml
`-- .env.example
```

## Ejecutar en desarrollo

1. Copia `.env.example` a `.env`
2. Levanta Mongo:

```bash
docker compose up -d mongo
```

3. Instala dependencias y levanta frontend + API:

```bash
npm install
npm run dev
```

Servicios:

- Web: `http://localhost:5173`
- API: `http://localhost:5050/api`
- Mongo: `mongodb://localhost:27017`

## Ejecutar todo con Docker

```bash
docker compose up --build
```

Servicios:

- Web: `http://localhost:4173`
- API: `http://localhost:5050/api`

## Comandos utiles

```bash
npm run build
npm run test
npm run lint
npm run seed
npm audit --omit=dev
```

## Flujo del pedido

1. El cliente explora el menu.
2. Agrega productos al carrito.
3. Completa nombre, telefono y entrega.
4. El frontend envia la orden al API.
5. El API valida, crea el pedido en Mongo y genera el texto.
6. El frontend abre el link `wa.me` para confirmar el pedido en WhatsApp.

## Dockploy

La guia operativa corta esta en [docs/dockploy.md](/C:/Users/DELL%203380/Documents/vps/docs/dockploy.md).

## Validacion realizada

- `npm run test -w api`
- `npm run test -w web`
- `npm run build`
- `npm run lint`
- `npm audit --omit=dev`

El reporte TDD esta en [docs/testing/brasa-barrio.tdd.md](/C:/Users/DELL%203380/Documents/vps/docs/testing/brasa-barrio.tdd.md).
