import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

import {
    getBooks,
    getFeaturedBooks,
    getNewBooks,
    searchBooks,
    getBooksByCategory,
    getBookById,
    getBooksByViews,
    getBooksByPrice,
    getBookChapters,
    getChapter,
    buyBook
}
from "../controllers/books.controller.js";

const router = express.Router();

router.get("/", getBooks);

router.get("/featured", getFeaturedBooks);

router.get("/new", getNewBooks);

router.get("/views", getBooksByViews);

router.get("/price", getBooksByPrice);

router.get("/search/:keyword", searchBooks);

router.get("/category/:id", getBooksByCategory);

router.get("/:id", getBookById);

router.get("/:id/chapters", getBookChapters);
router.get(
    "/:bookId/chapter/:chapterNumber",
    verifyToken,
    getChapter
);
router.post(
    "/buy",
    verifyToken,
    buyBook
);
export default router;