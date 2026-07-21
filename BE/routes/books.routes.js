    import express from "express";
    import { verifyToken } from "../middlewares/auth.middleware.js";
    import upload from "../middlewares/upload.middleware.js";
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
        buyBook,
        createBook,
        updateBook,
        deleteBook,
        getComingSoonBooks

    }
    from "../controllers/books.controller.js";

    const router = express.Router();

    router.get("/", getBooks);
    router.post(

        "/",

        upload.single("cover_image"),

        createBook

    );

    router.get("/featured", getFeaturedBooks);

    router.get("/new", getNewBooks);

    router.get("/views", getBooksByViews);

    router.get("/price", getBooksByPrice);

    router.get("/coming-soon", getComingSoonBooks);

    router.get("/search/:keyword", searchBooks);

    router.get("/category/:id", getBooksByCategory);

    router.get("/:id", getBookById);

    router.get("/:id/chapters", getBookChapters);
    router.get(
        "/:bookId/chapter/:chapterNumber",
        verifyToken,
        getChapter
    );
    router.put(
        "/:id",
        upload.single("cover_image"),
        updateBook
    );
    router.delete("/:id", deleteBook);
    router.post(
        "/buy",
        verifyToken,
        buyBook
    );
    export default router;