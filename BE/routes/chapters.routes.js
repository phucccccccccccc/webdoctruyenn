import express from "express";
import upload from "../middlewares/upload.middleware.js";

import {
    getChapters,
    getChapter,
    createChapter,
    updateChapter,
    deleteChapter
    
} from "../controllers/chapters.controller.js";
    console.log("chapters.routes.js loaded");
const router = express.Router();
router.get("/test", (req, res) => {
    res.send("OK CHAPTER");
});
router.get("/book/:bookId", getChapters);

router.get("/:id", getChapter);

router.post(
    "/",
    upload.array("images", 200),
    createChapter
);

router.put(
    "/:id",
    upload.array("images", 200),
    updateChapter
);

router.delete("/:id", deleteChapter);
router.get("/abc", (req, res) => {
    res.json({
        message: "abc"
    });
});
export default router;