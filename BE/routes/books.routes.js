import express from "express";

import {
    getBooks,
    getFeaturedBooks,
    getNewBooks
}
from "../controllers/books.controller.js";

const router = express.Router();

router.get("/", getBooks);

router.get("/featured", getFeaturedBooks);

router.get("/new", getNewBooks);

export default router;