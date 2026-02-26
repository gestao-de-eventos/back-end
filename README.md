# API-Rest---login-JWT

## Project:

## dependences:

> - express
> - mongoose
> - tsx
> - ts
> - bcrypt
> - webtoken
> - joi - @hapi/joi
> - serverless-http

## Routes

# Documentação da API

> Arquivo gerado automaticamente a partir do código fonte.

#https://api-rest-login-jwt.vercel.app
---

**Prefixos de rota**

- `/user` — rotas de usuário (ver `src/routes/userRouter.ts`)
- `/event` — rotas de eventos (ver `src/routes/eventRouter.ts`)
- `/admin` — rotas administrativas (ver `src/routes/adminRouter.ts`)

**Autenticação**

- Header `Authorization`: aceita `Bearer <TOKEN>` ou `<TOKEN>`.
- Token JWT criado em `src/utils/jwt.ts` contém `{ name, id, email, admin }` e expira em 5h.

---

**Rotas - Usuário**

- **POST /user/register**

  - Descrição: registra um novo usuário.
  - **Auth:** nenhuma
  - **Headers:**
    - `Content-Type: application/json` (obrigatório)
  - **Body (JSON):**
    ```json
    {
      "name": "string",
      "email": "string",
      "phone": "string",
      "cpf": "string",
      "contaSicoob": true,
      "password": "string"
    }
    ```
  - Resposta: `201` documento do usuário (evite retornar o campo `password`).
- **POST /user/login**

  - Descrição: autentica e retorna token JWT.
  - **Auth:** nenhuma
  - **Headers:**
    - `Content-Type: application/json` (obrigatório)
  - **Body (JSON):** `{ "email": "string", "password": "string" }`
  - Resposta: header `Authorization: <token>` e corpo `{ "message": "User logged", "token": "<token>" }`.
- **GET /user/getUsers**

  - Descrição: lista usuários não-admin (exclui o solicitante pelo email).
  - **Auth:** `auth` + `authAdmin`
  - **Headers:**
    - `Authorization: Bearer <TOKEN>` (obrigatório)
  - **Resposta:** `200` array de usuários (projeção `-password`).
  - Filtro aplicado: `admin: { $ne: true }, email: { $ne: requesterEmail }`.
- **GET /user/myEvents**

  - Descrição: eventos nos quais o usuário está inscrito.
  - **Auth:** `auth`
  - **Headers:**
    - `Authorization: Bearer <TOKEN>` (obrigatório)
  - **Resposta:** `200` resultado de `getEventsByUser` com campos: `dataDaInscricao`, `evento`, `dataDoEvento`.

---

**Rotas - Evento**

- **POST /event/register**

  - Descrição: cria um evento.
  - **Auth:** o controller usa `req.user.id` — a rota deve receber `Authorization` no header; recomenda-se adicionar `auth` middleware para proteger a rota.
  - **Headers:**
    - `Authorization: Bearer <TOKEN>` (recomendado/obrigatório se a rota estiver protegida)
    - `Content-Type: application/json` (obrigatório)
  - **Body (JSON):**
    ```json
    {
      "title": "string",
      "description": "string",
      "local": "string",
      "date": "2026-02-24T12:00:00.000Z",
      "capacity": 100
    }
    ```
  - Resposta: `201` documento `Event` criado.
  - Observação: no código atual `local` é preenchido com `description` — corrija para `req.body.local`.
- **POST /event/register/link/:eventID**

  - Descrição: inscreve o usuário no evento (cria `Link`).
  - **Auth:** `auth`
  - **Headers:**
    - `Authorization: Bearer <TOKEN>` (obrigatório)
  - **Params:** `eventID`
  - **Resposta:** `201` documento `Link`; incrementa `Event.participantsCount`.
  - Erro: se já inscrito retorna `400 "Você já está inscrito!"`.
- **GET /event/:eventID/users**

  - Descrição: lista usuários inscritos em um evento.
  - **Auth:** `auth` + `authAdmin`
  - **Headers:**
    - `Authorization: Bearer <TOKEN>` (obrigatório)
  - **Params:** `eventID`
  - **Resposta:** `200` array com `{ dataInscricao, idUsuario, nome, email, telefone, constSicoob }`.

---

**Rotas - Admin**

- **GET /admin/getUsers**
  - Mesma funcionalidade de `/user/getUsers`.
  - **Auth:** `auth` + `authAdmin`.
  - **Headers:**
    - `Authorization: Bearer <TOKEN>` (obrigatório)

---

**Modelos / Banco (MongoDB via Mongoose)**

- `User` (`src/models/User.ts`)

  - Campos:
    - `name: String` (required, 3–50)
    - `email: String` (required, unique)
    - `phone: String` (required)
    - `cpf: String` (required, unique)
    - `contaSicoob: Boolean` (required)
    - `password: String` (required, hashed)
    - `admin: Boolean` (default: `false`)
    - `creatAt: Date` (default: now)
  - Observação: o `admin` foi removido de criação explícita; usa `default:false`.
- `Event` (`src/models/Event.ts`)

  - Campos:
    - `title`, `description`, `local`, `date`, `capacity` (required)
    - `participantsCount: Number` (default: 0)
    - `organizerId: ObjectId` (ref `User`)
- `Link` (`src/models/Link.ts`)

  - Campos:
    - `eventID: ObjectId` (ref `Event`)
    - `userID: ObjectId` (ref `User`)
    - `subscribedAt: Date` (default: now)
  - Índice único: `{ eventID: 1, userID: 1 }` (prevenção de duplicação)

---

**Pipelines (consultas agregadas)**

- `getUsersByEvent(eventID)` (`src/models/pipelines.ts`): combina `Link` ⇢ `users` e projeta dados de inscrição e usuário.
- `getEventsByUser(userID)` (`src/models/pipelines.ts`): combina `Link` ⇢ `events` e projeta `dataDaInscricao`, `evento`, `dataDoEvento`.

---

**Exemplos (curl)**

- Registrar usuário:

```bash
curl -X POST http://localhost:PORT/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Joao","email":"joao@example.com","phone":"11999999999","cpf":"12345678901","contaSicoob":true,"password":"senha"}'
```

- Login:

```bash
curl -X POST http://localhost:PORT/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha"}'
```

- Requisição protegida (`getUsers`):

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:PORT/user/getUsers
```


---

Gerado a partir dos arquivos em `src/`.




