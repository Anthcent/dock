from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "Brasa_de_Barrio_Docker_Implementacion.docx"


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def add_code_block(document: Document, title: str, code: str) -> None:
    if title:
        document.add_paragraph(title, style="Intense Quote")

    for line in code.strip("\n").splitlines():
        paragraph = document.add_paragraph()
        run = paragraph.add_run(line)
        run.font.name = "Consolas"
        run.font.size = Pt(9.5)
        paragraph.paragraph_format.left_indent = Inches(0.35)
        paragraph.paragraph_format.space_after = Pt(0)
        paragraph.paragraph_format.space_before = Pt(0)


def add_bullet(document: Document, text: str) -> None:
    document.add_paragraph(text, style="List Bullet")


document = Document()

styles = document.styles
styles["Normal"].font.name = "Calibri"
styles["Normal"].font.size = Pt(10.5)
styles["Title"].font.name = "Arial"
styles["Title"].font.size = Pt(24)
styles["Title"].font.bold = True
styles["Heading 1"].font.name = "Arial"
styles["Heading 1"].font.size = Pt(16)
styles["Heading 1"].font.bold = True
styles["Heading 2"].font.name = "Arial"
styles["Heading 2"].font.size = Pt(13)
styles["Heading 2"].font.bold = True

title = document.add_paragraph(style="Title")
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
title_run = title.add_run("Implementacion del Sistema Brasa de Barrio con Docker")
title_run.font.color.rgb = RGBColor(33, 33, 33)

subtitle = document.add_paragraph()
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
subtitle.add_run(
    "Documento tecnico orientado al proceso, con enfasis en Docker, contenedorizacion y pasos de despliegue."
)

document.add_paragraph(
    "Proyecto base: sistema MERN de menu y pedidos por WhatsApp para una hamburgueseria, preparado para ser "
    "probado en una VPS y luego administrado desde Dockploy."
)

document.add_heading("1. Objetivo del sistema", level=1)
document.add_paragraph(
    "El objetivo fue construir un sistema realista y util que sirviera para dos cosas al mismo tiempo: "
    "tener una aplicacion funcional para un negocio de hamburguesas y, a la vez, usarla como laboratorio "
    "para aprender Docker, despliegue en VPS, contenedores separados y flujo posterior hacia Dockploy."
)

document.add_heading("2. Arquitectura implementada", level=1)
add_bullet(document, "Frontend: React + Vite + TypeScript en la carpeta `web/`.")
add_bullet(document, "Backend: Express + Mongoose + Zod en la carpeta `api/`.")
add_bullet(document, "Base de datos: MongoDB como servicio independiente en contenedor.")
add_bullet(document, "Orquestacion local: `docker-compose.yml` en la raiz del proyecto.")
add_bullet(document, "Persistencia: volumen para MongoDB.")
add_bullet(document, "Flujo del negocio: menu -> carrito -> checkout -> pedido -> enlace de WhatsApp.")

document.add_heading("3. Estructura de carpetas relevante para Docker", level=1)
add_code_block(
    document,
    "",
    """
vps/
|-- api/
|   |-- Dockerfile
|   |-- package.json
|   `-- src/
|-- web/
|   |-- Dockerfile
|   |-- package.json
|   `-- src/
|-- docs/
|-- docker-compose.yml
|-- package.json
`-- .env.example
""",
)

document.add_heading("4. Como se implemento Docker en el proyecto", level=1)
document.add_paragraph(
    "Docker se implemento separando claramente las responsabilidades. Cada parte del stack tiene un rol y un "
    "contenedor propio. Esto facilita las pruebas en VPS, el aislamiento de dependencias y la reproduccion "
    "exacta del entorno."
)

document.add_heading("4.1 Contenedor del backend", level=2)
document.add_paragraph(
    "Se creo un `Dockerfile` en `api/` con enfoque multi-stage. En la primera etapa se compilan los archivos "
    "TypeScript y en la segunda se ejecuta solo la salida necesaria para produccion."
)
add_code_block(
    document,
    "Archivo utilizado: api/Dockerfile",
    """
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY api/package*.json ./api/
RUN npm install
COPY api ./api
WORKDIR /app/api
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/api/package*.json ./api/
RUN npm install --omit=dev
COPY --from=builder /app/api/dist ./api/dist
WORKDIR /app/api
CMD ["node", "dist/server.js"]
""",
)
add_bullet(document, "Imagen base usada: `node:22-alpine`.")
add_bullet(document, "Primera etapa: instala dependencias y compila TypeScript.")
add_bullet(document, "Segunda etapa: instala solo dependencias de produccion.")
add_bullet(document, "Comando final: ejecuta `node dist/server.js`.")

document.add_heading("4.2 Contenedor del frontend", level=2)
document.add_paragraph(
    "El frontend tambien usa multi-stage. Primero compila con Vite y luego se sirve como sitio estatico con "
    "`serve`, lo que simplifica el despliegue inicial."
)
add_code_block(
    document,
    "Archivo utilizado: web/Dockerfile",
    """
FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=http://localhost:5050/api
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
COPY web/package*.json ./web/
RUN npm install
COPY web ./web
WORKDIR /app/web
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/web/dist ./dist
CMD ["serve", "-s", "dist", "-l", "4173"]
""",
)
add_bullet(document, "Se uso `ARG VITE_API_URL` para inyectar la URL del API en build time.")
add_bullet(document, "El sitio compilado se sirve en el puerto `4173`.")
add_bullet(document, "Esta estrategia es simple y muy util para aprendizaje y despliegue inicial.")

document.add_heading("4.3 Servicio de MongoDB", level=2)
document.add_paragraph(
    "MongoDB no se construye desde un Dockerfile propio, sino que se usa una imagen oficial (`mongo:7`). "
    "Esto acelera el despliegue y reduce trabajo innecesario."
)

document.add_heading("5. Orquestacion con Docker Compose", level=1)
document.add_paragraph(
    "El archivo `docker-compose.yml` fue el punto central para levantar el stack completo. En el se definen "
    "los servicios `mongo`, `api` y `web`, sus puertos, dependencias y variables."
)
add_code_block(
    document,
    "Archivo utilizado: docker-compose.yml",
    """
services:
  mongo:
    image: mongo:7
    container_name: brasa-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - ./mongodb-data:/data/db

  api:
    build:
      context: .
      dockerfile: ./api/Dockerfile
    environment:
      PORT: 5050
      MONGO_URI: mongodb://mongo:27017/brasa-barrio
      WHATSAPP_PHONE: 584120000000
      CORS_ORIGIN: http://localhost:4173,http://localhost:5173
    depends_on:
      - mongo
    ports:
      - "5050:5050"

  web:
    build:
      context: .
      dockerfile: ./web/Dockerfile
      args:
        VITE_API_URL: http://localhost:5050/api
    depends_on:
      - api
    ports:
      - "4173:4173"
""",
)

document.add_heading("6. Variables y configuracion", level=1)
document.add_paragraph(
    "Para dejar el proyecto portable, se definio un `.env.example` con las variables base."
)
add_code_block(
    document,
    "Archivo utilizado: .env.example",
    """
MONGO_URI=mongodb://mongo:27017/brasa-barrio
PORT=5050
WHATSAPP_PHONE=584120000000
VITE_API_URL=http://localhost:5050/api
""",
)

table = document.add_table(rows=1, cols=3)
table.style = "Table Grid"
header = table.rows[0].cells
header[0].text = "Variable"
header[1].text = "Uso"
header[2].text = "Donde aplica"
for cell in header:
    set_cell_shading(cell, "D9EAD3")

rows = [
    ("MONGO_URI", "Conexion a MongoDB", "API"),
    ("PORT", "Puerto del backend", "API"),
    ("WHATSAPP_PHONE", "Numero del negocio", "API"),
    ("CORS_ORIGIN", "Origenes permitidos del frontend", "API"),
    ("VITE_API_URL", "URL base del backend", "Web build"),
]
for variable, use, where in rows:
    cells = table.add_row().cells
    cells[0].text = variable
    cells[1].text = use
    cells[2].text = where

document.add_heading("7. Comandos usados durante la implementacion", level=1)
document.add_paragraph(
    "A continuacion se listan los comandos mas importantes usados o preparados para este proyecto."
)
add_code_block(
    document,
    "Inicializacion del frontend y estructura base",
    """
npm create vite@latest web -- --template react-ts
npm init -y
npm init -y --workspace api
""",
)
add_code_block(
    document,
    "Instalacion de dependencias",
    """
npm install
""",
)
add_code_block(
    document,
    "Desarrollo local",
    """
docker compose up -d mongo
npm run dev
""",
)
add_code_block(
    document,
    "Validacion tecnica",
    """
npm run test -w api
npm run test -w web
npm run build
npm run lint
npm audit --omit=dev
""",
)
add_code_block(
    document,
    "Levantamiento completo con Docker",
    """
docker compose up --build
""",
)

document.add_heading("8. Paso a paso para implementarlo en otra maquina o VPS", level=1)
steps = [
    "Clonar o copiar el proyecto a la VPS.",
    "Verificar que Docker y Docker Compose esten instalados.",
    "Crear el archivo `.env` a partir de `.env.example`.",
    "Ajustar `WHATSAPP_PHONE`, `CORS_ORIGIN` y cualquier dominio real.",
    "Ejecutar `docker compose up --build`.",
    "Comprobar que Mongo, API y Web levanten correctamente.",
    "Probar `GET /api/health` y `GET /api/menu`.",
    "Entrar al frontend y completar un pedido de prueba.",
]
for step in steps:
    document.add_paragraph(step, style="List Number")

document.add_heading("9. Como probar que Docker esta funcionando", level=1)
add_code_block(
    document,
    "",
    """
docker ps
docker compose logs api
docker compose logs web
docker compose logs mongo
""",
)
document.add_paragraph("Indicadores de funcionamiento esperado:")
add_bullet(document, "Mongo debe quedar en estado `Up`.")
add_bullet(document, "El API debe responder en `http://localhost:5050/api/health`.")
add_bullet(document, "La web debe responder en `http://localhost:4173`.")
add_bullet(document, "El menu debe cargar y permitir enviar un pedido por WhatsApp.")

document.add_heading("10. Relacion con Dockploy", level=1)
document.add_paragraph(
    "La implementacion se preparo para que el salto a Dockploy sea natural. Hay dos rutas de aprendizaje:"
)
add_bullet(document, "Usar el `docker-compose.yml` directamente como stack.")
add_bullet(document, "Separar `mongo`, `api` y `web` como servicios individuales.")
document.add_paragraph(
    "La segunda opcion suele ser mejor para aprender Dockploy porque obliga a entender redes, variables, "
    "dominios, orden de despliegue y persistencia."
)

document.add_heading("11. Buenas practicas aplicadas", level=1)
add_bullet(document, "Separacion clara entre frontend, backend y base de datos.")
add_bullet(document, "Uso de multi-stage builds para reducir peso final.")
add_bullet(document, "Variables de entorno en lugar de valores quemados.")
add_bullet(document, "Persistencia de Mongo con volumen.")
add_bullet(document, "Pruebas y build ejecutados antes de cerrar la implementacion.")
add_bullet(document, "Base lista para evolucionar hacia proxy reverso, SSL y dominios reales.")

document.add_heading("12. Conclusiones", level=1)
document.add_paragraph(
    "Docker no se uso solo como un extra tecnico, sino como base del proceso. Permite que el sistema se "
    "pueda mover con menos friccion desde desarrollo local hacia la VPS y luego a Dockploy. Esto convierte "
    "el proyecto en una muy buena practica para aprender despliegue real, diagnostico de contenedores, "
    "manejo de variables, persistencia y flujo de publicacion."
)

document.add_paragraph()
footer = document.add_paragraph()
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
footer_run = footer.add_run("Documento generado automaticamente para el proyecto Brasa de Barrio")
footer_run.italic = True

document.save(OUTPUT)
print(f"Created: {OUTPUT}")
