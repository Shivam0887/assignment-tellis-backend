import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import router from "./routes/index.js";
import { ConnectToDB } from "./configs/database.js";
const app = express();
ConnectToDB();
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(cors({
    origin: "https://zxsmwnmb-5173.inc1.devtunnels.ms",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);
// app.use(errorHandler);
app.listen(5000, () => {
    console.log("Server started...");
});
//# sourceMappingURL=index.js.map