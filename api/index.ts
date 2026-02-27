// ./api/index.ts

import app from "../src/app.js";
import { connection } from "../src/database/connection.js";
await connection();
export default app; 