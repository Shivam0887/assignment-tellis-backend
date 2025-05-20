import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const authenticateToken = (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        res.status(401).json({ message: "Access token required" });
    }
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Access token expired" });
        }
        console.error("Token verification error:", error);
        res.status(403).json({ message: "Invalid access token" });
    }
};
//# sourceMappingURL=auth.middleware.js.map