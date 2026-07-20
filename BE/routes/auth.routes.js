import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import {
    sendRegisterOTP,
    verifyRegisterOTP,
    login,
    googleLogin,
    profile,
    sendForgotOTP,
    verifyForgotOTP,
    resetPassword
} from "../controllers/auth.controller.js";



const router = express.Router();
router.post("/send-forgot-otp", sendForgotOTP);

router.post("/verify-forgot-otp", verifyForgotOTP);

router.post("/reset-password", resetPassword);

router.post("/send-register-otp", sendRegisterOTP);

router.post("/verify-register-otp", verifyRegisterOTP);

router.post("/login", login);

router.post("/google", googleLogin);

router.get("/profile", verifyToken, profile);

router.post(
    "/books",
    verifyToken,
    isAdmin
    
);
export default router;