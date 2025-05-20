import { Task } from "../models/task.model.js";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
export const TaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["todo", "in-progress", "completed"]),
    priority: z.enum(["low", "medium", "high"]),
    dueDate: z.coerce.date(),
    assignee: z.string().optional(),
});
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignee } = TaskSchema.parse(req.body);
        const email = req.user.email;
        const id = uuidv4();
        const newTask = new Task({
            id,
            title,
            description,
            status,
            priority,
            dueDate,
            assignee,
            email,
        });
        await newTask.save();
        res
            .status(201)
            .json({
            success: true,
            data: id,
        })
            .end();
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating task",
        });
    }
};
const getTasks = async (req, res) => {
    try {
        const email = req.user.email;
        const tasks = await Task.find({ email }, { email: 0, _id: 0, createdAt: 0, updatedAt: 0 });
        res
            .status(200)
            .json({
            success: true,
            data: tasks,
        })
            .end();
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching tasks",
        });
    }
};
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ id });
        if (task === null) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res
            .status(200)
            .json({
            success: true,
            data: task,
        })
            .end();
    }
    catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching task",
        });
    }
};
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate, assignee } = TaskSchema.parse(req.body);
        const updatedTask = await Task.findOneAndUpdate({ id }, {
            title,
            description,
            status,
            priority,
            dueDate,
            assignee,
        }, { new: true });
        if (updatedTask === null) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res
            .status(200)
            .json({
            success: true,
            data: id,
        })
            .end();
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating task",
        });
    }
};
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findOneAndDelete({ id });
        if (!deletedTask) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res
            .status(200)
            .json({
            success: true,
            message: "Task deleted successfully",
            data: deletedTask,
        })
            .end();
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting task",
        });
    }
};
export { createTask, getTasks, getTaskById, updateTask, deleteTask };
//# sourceMappingURL=task.controller.js.map