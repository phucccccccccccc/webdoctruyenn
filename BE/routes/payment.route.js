import express from "express";
import {
    createPayment,
    webhook,
    paymentSuccess
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

router.post(
    "/success",
    paymentSuccess
);

export default router;