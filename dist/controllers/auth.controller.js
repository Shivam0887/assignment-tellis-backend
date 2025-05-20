import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: "Refresh token not found" });
            return;
        }
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findOne({ email: decoded.email });
        if (user === null) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        req.user = decoded;
        const newAccessToken = generateAccessToken({ email: decoded.email });
        setAccessRefreshTokenCookie(res, newAccessToken, "accessToken");
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res
                .status(401)
                .json({ message: "Refresh token expired. Please login again" });
            return;
        }
        console.error("Token refresh error:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};
const setAccessRefreshTokenCookie = (res, token, tokenType) => {
    res.cookie(tokenType, token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: tokenType === "accessToken" ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    });
    const resp = res.getHeader("Set-Cookie");
    console.log(resp);
};
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "User with this email already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const accessToken = generateAccessToken({ email });
        const refreshToken = generateRefreshToken({ email });
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        setAccessRefreshTokenCookie(res, accessToken, "accessToken");
        setAccessRefreshTokenCookie(res, refreshToken, "refreshToken");
        res
            .status(201)
            .json({
            message: "User registered successfully",
            user: {
                id: newUser._id.toString(),
                username: newUser.username,
                email: newUser.email,
            },
            accessToken,
        })
            .end();
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user === null) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const accessToken = generateAccessToken({ email: user.email });
        const refreshToken = generateRefreshToken({ email: user.email });
        setAccessRefreshTokenCookie(res, accessToken, "accessToken");
        setAccessRefreshTokenCookie(res, refreshToken, "refreshToken");
        res
            .status(200)
            .json({
            message: "Login successful",
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
            accessToken,
        })
            .end();
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const logout = async (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout successful" }).end();
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export { register, login, logout, refreshToken };
//# sourceMappingURL=auth.controller.js.map