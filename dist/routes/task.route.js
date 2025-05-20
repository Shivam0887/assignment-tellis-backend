import express from "express";
import { getTasks, createTask, deleteTask, getTaskById, updateTask, } from "../controllers/task.controller.js";
const router = express.Router();
router.get("/", getTasks); // Fetch all tasks for a logged-in user
router.get("/:id", getTaskById); // Fetch a single task by ID
router.post("/", createTask); // Create a new task
router.put("/:id", updateTask); // Update a task
router.delete("/:id", deleteTask); // Delete a task
export default router;
//# sourceMappingURL=task.route.js.map