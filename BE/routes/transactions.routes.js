import express from "express";
import {getTransactions} from "../controllers/transactions.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router =express.Router();
router.get(
    "/",
    verifyToken,
    getTransactions
);

export default router;