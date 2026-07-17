import express from "express";
import { getUser,getPurchasedBooks,updateReadingHistory,getReadingHistory,getProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router =express.Router();
router.get("/",getUser);
router.get(
    "/books",
    verifyToken,
    getPurchasedBooks
);router.get(
    "/history",
    verifyToken,
    getReadingHistory
);router.post(
    "/history",
    verifyToken,
    updateReadingHistory
);
router.get(
    "/profile",
    verifyToken,
    getProfile
);
export default router;