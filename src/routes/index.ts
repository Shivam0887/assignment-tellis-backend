import express from "express";
import authRouter from "../routes/auth.route.js";
import taskRouter from "../routes/task.route.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { refreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/tasks", refreshToken, authenticateToken, taskRouter);

export default router;
