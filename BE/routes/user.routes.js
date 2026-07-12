import express from "express";
import { getUser,getPurchasedBooks,updateReadingHistory,getReadingHistory } from "../controllers/user.controller.js";

const router =express.Router();
router.get("/",getUser);
router.get("/books/:userId", getPurchasedBooks);
router.post("/history", updateReadingHistory);
router.get("/history/:userId", getReadingHistory);
export default router;