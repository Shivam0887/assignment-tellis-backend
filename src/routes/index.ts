import express from "express";
import authRouter from "../routes/auth.route.js";
import taskRouter from "../routes/task.route.js";
import userRouter from "../routes/user.route.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { refreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.use("/auth", authRouter);

/**
 * next('route'): skips the remaining handlers for the current route and
 * passes control to the next matching route for the same path and method
 */

/**
 * next('router'): skips the rest of the middleware for the current router
 * instance and passes control back to the parent router or application-level middleware
 */

router.use("/tasks", authenticateToken, taskRouter);
router.use("/tasks", refreshToken, taskRouter);

router.use("/user", authenticateToken, userRouter);
router.use("/user", refreshToken, userRouter);

export default router;
