import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import booksRoutes from "./routes/books.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import chapterRoutes from "./routes/chapters.routes.js";
import userRoutes from "./routes/user.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import paymentRoutes from "./routes/payment.route.js";

import { verifyToken } from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Test DB
app.get("/test", (req, res) => {
    res.json({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chapters", chapterRoutes);

// Test JWT
app.get("/api/profile", verifyToken, (req, res) => {
    res.json(req.user);
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("========== ERROR ==========");
    console.error(err);

    res.status(500).json({
        message: err.message,
        name: err.name,
        stack: err.stack
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});