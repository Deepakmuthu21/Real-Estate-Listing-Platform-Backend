import express from "express";
import { createUser, deleteUser, forgotPassword, getId, getUser, loginUser, resetPassword } from "../Controllers/user_controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register-user", createUser);
router.post("/login",loginUser);

router.get("/getuser",authMiddleware,getUser)
router.get("/get/:id",getId)
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:id/:token",resetPassword);
router.delete("/delete-user/:id",deleteUser)

export default router;