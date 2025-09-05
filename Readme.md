📘 Backend API – Patitas al Rescate
desplegado : https://final-backend-msfy.onrender.com

Documentación completa (stack + instalación + endpoints + ejemplos)
📦 1. Stack & dependencias

| Capa          | Tecnología         | Versión sugerida | Propósito                         |
| ------------- | ------------------ | ---------------- | --------------------------------- |
| Runtime       | Node.js            | 20.x LTS         | Ejecutar JavaScript en servidor   |
| Servidor      | Express            | 4.19.x           | Router, middlewares, REST         |
| Base de datos | MongoDB            | 6.x              | Base NoSQL                        |
| ODM           | Mongoose           | 8.x              | Modelado y validación de esquemas |
| Auth          | jsonwebtoken       | 9.x              | Firmar y verificar tokens         |
| Hash          | bcryptjs           | 2.x              | Hashear passwords                 |
| Validación    | express-validator  | 7.x              | Validar y sanitizar payloads      |
| Seguridad     | helmet             | 7.x              | Headers de seguridad              |
| Rate-limit    | express-rate-limit | 7.x              | Mitigar fuerza bruta              |
| CORS          | cors               | 2.x              | Control de orígenes cruzados      |
| Logs          | winston            | 3.x              | Logs estructurados por nivel      |
| Entornos      | dotenv             | 16.x             | Cargar variables `.env`           |
| Testing       | vitest + supertest | 1.x              | Tests unitarios / integración     |
| Docs          | swagger-ui-express | 5.x              | Documentación interactiva         |

📁 2. Estructura de carpetas

patitas-back/
├── src/
│   ├── config/               # Configuración centralizada
│   │   ├── db.mjs            # Conexión MongoDB
│   ├── controllers/          # Lógica de rutas
│   ├── middleware/           # Auth, errores, ownership
│   ├── models/               # Esquemas Mongoose
│   ├── repositories/         # Capa de acceso a datos
│   ├── routes/               # Definición de endpoints
│   ├── services/             # Reglas de negocio
│   ├── utils/                # Logs, paginación, upload
│   ├── validators/           # Reglas express-validator
│   └── scripts/              # Seeds y migraciones
├── logs/                     # Generados por winston
├── tests/                    # Suites vitest
├── .env.example
├── Server.mjs                #inicializa 
└── package.json

⚙️ 3. Instalación paso a paso
1.Clonar repo

git clone https://github.com/LautaroET/patitas-backend.git
cd patitas-backend

2.Instalar dependencias
npm install

3.Variables de entorno
cp .env.example .env
# completar MONGO_URI, JWT_SECRET, PORT, ALLOWED_ORIGINS

4.Seed inicial (roles + permisos)
node src/scripts/seedRoles.mjs

5.Levantar servidor
npm run dev        # modo watch con --watch
npm start          # producción

6-Swagger UI
Abrir http://localhost:3000/docs


🔐 4. Variables de entorno (.env)
| Variable          | Ejemplo                                       | Descripción     |
| ----------------- | --------------------------------------------- | --------------- |
| `MONGO_URI`       | `mongodb://localhost:27017/patitas`           | URI de MongoDB  |
| `JWT_SECRET`      | `superSecreto!2025`                           | Firma de tokens |
| `PORT`            | `3000`                                        | Puerto servidor |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | CORS            |

📚 5. Autenticación ⚡ JWT Bearer
1.Login → obtienes token
2.Enviar header:
  Authorization: Bearer <token>
3.Token expira en 24 h (configurable).

📋 6. Roles & permisos (resumen)

| Rol         | Permisos principales                                            |
| ----------- | --------------------------------------------------------------- |
| **común**   | crear refugio, crear/listar **sus** solicitudes (adoptar / dar) |
| **refugio** | CRUD mascotas, gestionar solicitudes, borrar refugio            |
| **admin**   | todos los permisos (`admin:all`)                                |

🔍 7. Endpoints completos
  Base URL: http://localhost:3000/api
  Todos los payloads son JSON.

📘 AUTH
1. Registro
http
POST /api/auth/register

Body:
JSON
{
  "username": "juan_p",
  "email": "juan@mail.com",
  "password": "123456",
  "nombreCompleto": { "nombre": "Juan", "apellido": "Pérez" },
  "fechaNacimiento": "2000-05-15"
}
Resp. 201:
JSON
{
  "user": { "_id": "...", "username": "juan_p", "email": "juan@mail.com", "tipo": "comun" },
  "token": "eyJhbGc..."
}
2. Login
2. Login
http
Copy
POST /api/auth/login
Body:
JSON
Copy
{ "email": "juan@mail.com", "password": "123456" }
Resp. 200: mismo formato que registro.
🏠 REFUGIOS
3. Listar todos los refugios
http
Copy
GET /api/refugios?page=1&limit=10
Resp. 200:
JSON
Copy
[
  { "_id": "...", "nombre": "El Campito", "direccion": "Calle 123", "usuario": {...} }
]
4. Ver refugio por ID
http
Copy
GET /api/refugios/:id
5. Crear refugio (auth → común)
http
Copy
POST /api/refugios
Auth: Bearer <token>
Body:
JSON
Copy
{
  "nombre": "El Campito",
  "direccion": "Calle 123",
  "telefono": "1155667788",
  "email": "campito@mail.com",
  "descripcion": "Refugio de perros y gatos"
}
Resp. 201 → objeto creado.
6. Mi refugio (auth → refugio)
http
Copy
GET /api/refugios/yo/mi
Auth: Bearer <token>
7. Eliminar mi refugio (auth → refugio) 🔥
http
Copy
DELETE /api/refugios
Auth: Bearer <token>
Cascada hard-delete:
Refugio + mascotas + solicitudes adopción + solicitudes dar-en-adopción borradas físicamente.
🐶 MASCOTAS
8. Listar mascotas (público)
http
Copy
GET /api/mascotas?especie=perro&estado=disponible&page=1&limit=20
9. Ver mascota por ID
http
Copy
GET /api/mascotas/:id
10. Crear mascota (auth → refugio)
http
Copy
POST /api/mascotas
Auth: Bearer <token>
Content-Type: multipart/form-data (si incluye fotos)
Body JSON:
JSON
Copy
{
  "nombre": "Thor",
  "especie": "perro",
  "genero": "macho",
  "edad": 2,
  "descripcion": "Muy juguetón",
  "imagen": [
    { "url": "https://res.cloudinary.com/.../thor1.jpg", "descripcion": "Thor en el jardín" }
  ],
  "tamano": "mediano",
  "nivelEnergia": "alto",
  "esterilizado": true
}
11. Actualizar mascota (auth → refugio + owner)
http
Copy
PUT /api/mascotas/:id
Auth: Bearer <token>
Body: mismos campos opcionales.
12. Eliminar mascota (auth → refugio + owner)
http
Copy
DELETE /api/mascotas/:id
Auth: Bearer <token>
📨 SOLICITUDES
13. Crear solicitud de adopción (auth → común)
http
Copy
POST /api/solicitudes/adopcion
Auth: Bearer <token>
Body:
JSON
Copy
{ "mascotaId": "66778899aa77bb88cc99dd00", "mensaje": "Me encantaría adoptar a Thor..." }
14. Listar mis solicitudes (usuario)
http
Copy
GET /api/solicitudes/adopcion/usuario
Auth: Bearer <token>
15. Listar solicitudes para mi refugio (auth → refugio)
http
Copy
GET /api/solicitudes/adopcion/refugio
Auth: Bearer <token>
16. Cambiar estado solicitud adopción (refugio)
http
Copy
PATCH /api/solicitudes/adopcion/:id
Auth: Bearer <token>
Body: { "estado": "aceptada" }   // valores: aceptada | rechazada
17-20. Solicitudes dar en adopción (mismos endpoints cambiando adopcion por dar-en-adopcion)
POST /api/solicitudes/dar-en-adopcion
GET /api/solicitudes/dar-en-adopcion/usuario
GET /api/solicitudes/dar-en-adopcion/refugio
PATCH /api/solicitudes/dar-en-adopcion/:id
🔐 ROLES / PERMISOS (público)
21. Listar roles
http
Copy
GET /api/roles
22. Listar permisos
http
Copy
GET /api/permissions
🩺 HEALTH CHECK
23. Salud del servicio
http
Copy
GET /api/health
Resp. 200:
JSON
Copy
{ "status": "ok", "ts": "2025-06-20T18:30:00.000Z", "uptime": 1200.45 }
📎 8. Ejemplos de uso rápido
Flujo completo usuario → adopta mascota
Registro
POST /api/auth/register → guarda token
Crear refugio (si quiere)
POST /api/refugios → rol cambia a refugio
Crear mascota
POST /api/mascotas → obtiene _id
Otro usuario (común) solicita adoptar
POST /api/solicitudes/adopcion
Dueño del refugio lista solicitudes
GET /api/solicitudes/adopcion/refugio
Acepta/rechaza
PATCH /api/solicitudes/adopcion/<id> → estado cambia
🧪 9. Testing
bash
Copy
# unitarios
npm run test:unit

# integración (usa BD de test)
npm run test:int

# cobertura
npm run test:coverage
Configura NODE_ENV=test y MONGO_URI=mongodb://localhost:27017/patitas_test antes de ejecutar.

📊 11. Logs & monitoreo
Winston rota logs diariamente:
logs/combined.log – todos los niveles
logs/error.log – solo errores
Formado JSON:
JSON
Copy
{"level":"error","message":"ENOENT: no such file","timestamp":"2025-06-20T18:30:00.000Z","traceId":"abc123","userId":"6677aa88"}
Integra con Grafana/Loki o ELK stack para visualización.
🚨 12. Seguridad checklist
✅ Helmet (headers)
✅ CORS restrictivo
✅ Rate-limit global (100 req/15 min IP)
✅ Rate-limit login (5 intentos/15 min)
✅ JWT 24 h exp
✅ bcrypt 10 rounds
✅ Sanitización HTML (xss)
✅ Validaciones express-validator
✅ MongoDB injection prevention (mongoose)
✅ .env nunca commiteado
✅ Logs sin datos sensibles
🔄 13. CI/CD Github Actions (ejemplo)
.github/workflows/ci.yml
yaml
Copy
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongo: { image: mongo:6, ports: ['27017:27017'] }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run test:ci
      - run: npm run build   # si usas esbuild/bundler
🛠️ 14. Mantenimiento
Table
Copy
Tarea	Comando	Frecuencia
Dump BD	mongodump --uri=$MONGO_URI --out=backups/$(date +%F)	Diario (cron)
Índices	npm run db:indexes	Post-deploy
Auditoría deps	npm audit && npm outdated	Semanal
Rotar logs	Logrotate o winston daily	Automático
📄 15. Licencia & contribución
MIT – uso libre para refugios y ONGs.
Pull-requests bienvenidos: seguir convención Conventional Commits.
