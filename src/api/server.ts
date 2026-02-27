// server.ts
import app from "../app.js";
import { connection } from "../database/connection.js";
const port = process.env.PORT;

await connection();
app.listen(port, () => console.log(`Server on ${port}`));