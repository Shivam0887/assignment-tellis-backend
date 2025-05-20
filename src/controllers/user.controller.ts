import { Request, Response } from "express";
import { User } from "../models/user.model.js";

export const getUser = async (req: Request, res: Response) => {
  const email = (req as any).user?.email;

  const user = await User.findOne({ email }, { username: 1, email: 1, _id: 0 });

  if (user === null) res.status(400).json({ message: "User not found" });
  res.status(200).json(user);
};
