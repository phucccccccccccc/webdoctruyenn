import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",

    port: process.env.DB_PORT
        ? Number(process.env.DB_PORT)
        : 3306,

    user: process.env.DB_USER || "root",

    password: process.env.DB_PASSWORD || "",

    database: process.env.DB_NAME || "truyentranh",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {

    if (err) {

        console.error("MySQL Error:");

        console.error(err.code);

        console.error(err.message);

        return;
    }

    console.log("Connected MySQL");

    console.log({
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || "truyentranh"
    });

    connection.release();

});