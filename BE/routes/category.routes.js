import express from "express";
import {getCategory} from "../controllers/category.controller.js";

const router=express.Router();
router.get("/",getCategory);

export default router;
