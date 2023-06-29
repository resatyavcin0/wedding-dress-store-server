import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/send-otp", authController.sendOTP);
router.post("/verify", authController.verifyAccount);
router.post("/login", authController.login);

export default router;
