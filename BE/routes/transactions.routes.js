import express from "express";
import {getAllTransactions,getTransactions} from "../controllers/transactions.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router =express.Router();
router.get(
    "/admin",
    verifyToken,
    getAllTransactions
);
router.get(
    "/",
    verifyToken,
    getTransactions
);
export default router;