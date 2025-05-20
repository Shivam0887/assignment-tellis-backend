import { z } from "zod";
const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, { message: "Username must be at least 3 characters" }),
    email: z
        .string()
        .trim()
        .email({ message: "Please provide a valid email address" })
        .toLowerCase(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .refine((password) => /\d/.test(password), {
        message: "Password must contain at least one number",
    })
        .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter",
    })
        .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
    })
        .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: "Password must contain at least one special character",
    }),
});
const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email({ message: "Please provide a valid email address" })
        .toLowerCase(),
    password: z.string().min(1, { message: "Password is required" }),
});
export const validateRegister = (req, res, next) => {
    try {
        registerSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const message = error.errors.map((err) => err.message).join(" ");
            res.status(400).json({
                message,
            });
        }
        res.status(400).json({ message: "Invalid input data" });
    }
};
export const validateLogin = (req, res, next) => {
    try {
        loginSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid credientials",
            });
        }
        res.status(400).json({ message: "Invalid input data" });
    }
};
//# sourceMappingURL=validation.middleware.js.map