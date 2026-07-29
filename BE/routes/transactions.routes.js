import express from "express";
import {getAllTransactions,getTransactions,getTransactionStatistics,getTransactionChart} from "../controllers/transactions.controller.js";
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
router.get("/statistics", getTransactionStatistics);
router.get("/chart", getTransactionChart);
export default router;