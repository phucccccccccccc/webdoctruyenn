import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
console.log(JSON.stringify(process.env.DB_PASSWORD));
db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connected MySQL");
    
  }
});