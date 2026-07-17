import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
    "/create",
    verifyToken,
    createPayment
);

export default router;