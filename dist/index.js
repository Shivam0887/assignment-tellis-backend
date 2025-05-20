import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { ConnectToDB } from "./configs/database.js";
const app = express();
ConnectToDB();
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true, // Allow cookies in cross-origin requests
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);
app.use(errorHandler);
app.listen(5000, () => {
    console.log("Server started...");
});
//# sourceMappingURL=index.js.map