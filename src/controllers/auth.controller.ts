import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  RegisterInput,
  LoginInput,
} from "../middlewares/validation.middleware.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const isProduction = process.env.NODE_ENV === "production";

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;

    const user = await User.findOne({ email: decoded.email });

    if (user === null) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateAccessToken({ email: decoded.email });

    setAccessRefreshTokenCookie(res, newAccessToken, "accessToken");
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Refresh token expired" });
      return;
    }

    console.error("Token refresh error:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const setAccessRefreshTokenCookie = (
  res: Response,
  token: string,
  tokenType: "accessToken" | "refreshToken"
): void => {
  res.cookie(tokenType, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    domain: "assignment-tellis-backend.onrender.com",
    maxAge: tokenType === "accessToken" ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  });

  const resp = res.getHeader("Set-Cookie");
  console.log(resp);
};

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as RegisterInput;

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
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginInput;

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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).user?.email;

    if (userEmail === undefined) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout successful" }).end();
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { register, login, logout, refreshToken };
