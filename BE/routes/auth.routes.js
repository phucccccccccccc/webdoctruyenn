import express from "express";
import { register, login,googleLogin,profile } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/profile", verifyToken, profile);
router.post(
    "/books",
    verifyToken,
    isAdmin
    
);
export default router;