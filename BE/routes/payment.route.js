import express from "express";
import {
    createPayment,
    webhook,
    getPaymentStatus,
    getAllPayments 
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
router.get("/admin", getAllPayments);


export default router;