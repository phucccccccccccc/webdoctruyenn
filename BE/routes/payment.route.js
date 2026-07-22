import express from "express";
import {
    createPayment,
    webhook,
    getPaymentStatus
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/create",
    verifyToken,
    createPayment
);

router.post(
    "/webhook",
    webhook
);


router.get(
    "/status/:order",
    verifyToken,
    getPaymentStatus
);

export default router;