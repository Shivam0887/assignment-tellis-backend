import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token === null)
        next();
    else {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next("route");
    }
};
//# sourceMappingURL=auth.middleware.js.map