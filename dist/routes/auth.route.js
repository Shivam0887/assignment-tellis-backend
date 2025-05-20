import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { validateLogin, validateRegister, } from "../middlewares/validation.middleware.js";
const router = express.Router();
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/logout", logout);
export default router;
//# sourceMappingURL=auth.route.js.map