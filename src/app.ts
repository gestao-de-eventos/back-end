import express from "express"
const app = express()

import cors from "cors"

//ROTAS PARA IMPORTAR -----------
import userRoutes from "./routes/userRouter.js"
import adminRoutes from "./routes/adminRouter.js"
import eventRoutes from "./routes/eventRouter.js"
import { connection } from "./database/connection.js"

app.use(express.json());
// Configuração do CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (como mobile ou Postman)
    if (!origin) return callback(null, true);
    return callback(null, true); // Libera qualquer origem dinamicamente
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

connection();
app.use("/user", userRoutes)
app.use("/event", eventRoutes)
app.use("/admin", adminRoutes)


export default app;