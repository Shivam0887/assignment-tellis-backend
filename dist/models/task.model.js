import { Schema, model } from "mongoose";
const taskSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        required: true,
        default: "todo",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true,
        default: "medium",
    },
    dueDate: {
        type: Date,
        required: true,
    },
    assignee: String,
    email: {
        type: String,
        required: true,
    },
}, { timestamps: true }).index({ taskId: 1 });
export const Task = model("Task", taskSchema);
//# sourceMappingURL=task.model.js.map