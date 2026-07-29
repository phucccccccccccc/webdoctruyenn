import express from "express";

import {
    getStats,
    getRevenue,
    getSales,
    getTopSales,
    getTopReading,
    getRecentTransactions
}
from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", getStats);
router.get("/revenue", getRevenue);
router.get("/sales", getSales);
router.get("/top-sales", getTopSales);
router.get("/top-reading", getTopReading);
router.get("/recent-transactions", getRecentTransactions);
export default router;