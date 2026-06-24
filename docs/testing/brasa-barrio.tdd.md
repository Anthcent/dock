# TDD Evidence Report - Brasa de Barrio

## Source plan

Plan derivado durante esta implementacion sobre un workspace vacio.

## User journeys

1. Como cliente, quiero ver un menu atractivo y claro, para decidir que pedir.
2. Como cliente, quiero armar un carrito, para preparar mi pedido sin salir del sitio.
3. Como cliente, quiero enviar el pedido por WhatsApp, para confirmar rapido con el negocio.
4. Como operador del negocio, quiero que la orden quede registrada en MongoDB, para poder revisar pedidos en la VPS.

## Task report

### Frontend catalogo y carrito

- Resumen: se implemento una landing/catalogo con categorias, destacados, carrito y formulario de checkout.
- Validacion:
  - `npm run test -w web`
- Garantia:
  - el menu renderiza
  - el carrito agrega, incrementa, decrementa y anota productos
  - el checkout maneja pedido vacio, exito y error

### API de menu y pedidos

- Resumen: se implementaron endpoints de salud, menu y ordenes, con validacion y persistencia.
- Validacion:
  - `npm run test -w api`
- Garantia:
  - el menu responde con marca e items
  - las ordenes validas generan link de WhatsApp
  - las ordenes invalidas regresan `400`
  - el API maneja errores del servicio

### Stack operativo

- Resumen: se prepararon Dockerfiles y `docker-compose.yml`.
- Validacion:
  - `npm run build`
  - `npm run lint`
  - `npm audit --omit=dev`
- Garantia:
  - frontend y backend compilan
  - lint pasa en ambos paquetes
  - no hay vulnerabilidades de produccion reportadas por `npm audit --omit=dev`

## Test specification

| # | What is guaranteed | Test file | Type | Result | Evidence |
|---|--------------------|-----------|------|--------|----------|
| 1 | El API de menu responde con marca y productos | `api/src/routes/menuRoutes.test.ts` | integration | PASS | `npm run test -w api` |
| 2 | El API de menu responde `500` si el servicio falla | `api/src/routes/menuRoutes.test.ts` | integration | PASS | `npm run test -w api` |
| 3 | El API de pedidos genera `wa.me` para pedidos validos | `api/src/routes/orderRoutes.test.ts` | integration | PASS | `npm run test -w api` |
| 4 | El API rechaza pedidos invalidos | `api/src/routes/orderRoutes.test.ts` | integration | PASS | `npm run test -w api` |
| 5 | El servicio de orden calcula subtotal y arma el mensaje | `api/src/services/orderService.test.ts` | unit | PASS | `npm run test -w api` |
| 6 | El servicio de menu usa Mongo o fallback seed segun corresponda | `api/src/services/menuService.test.ts` | unit | PASS | `npm run test -w api` |
| 7 | La UI muestra advertencia si el carrito esta vacio | `web/src/App.test.tsx` | component | PASS | `npm run test -w web` |
| 8 | La UI completa un pedido exitoso y abre WhatsApp | `web/src/App.test.tsx` | component | PASS | `npm run test -w web` |
| 9 | La UI maneja errores de envio y permite editar el carrito | `web/src/App.test.tsx` | component | PASS | `npm run test -w web` |
| 10 | Los helpers del carrito mantienen cantidades y subtotal | `web/src/lib/cart.test.ts` | unit | PASS | `npm run test -w web` |
| 11 | Los helpers del API consumen backend o fallback local | `web/src/lib/api.test.ts` | unit | PASS | `npm run test -w web` |

## Coverage and known gaps

- `npm run test -w api`
  - Lines: `100%`
  - Branches: `81.81%`
  - Functions: `100%`
- `npm run test -w web`
  - Lines: `98.74%`
  - Branches: `92.95%`
  - Functions: `100%`

Gaps intencionales:

- `api/src/server.ts` y `api/src/scripts/seed.ts` quedan fuera del umbral porque son entrypoints operativos, no logica de dominio.
- `web/src/main.tsx`, `web/src/types.ts` y `web/src/data/**` quedan fuera del umbral por ser bootstrap y datos estaticos.
