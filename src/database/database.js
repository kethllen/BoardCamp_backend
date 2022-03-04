import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
console.log("oi " + process.env.DATABASE_URL);
const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default connection;
