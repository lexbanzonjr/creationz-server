import { Request, Response } from "express";
import userModel from "../models/userModel";
import { decodeToken } from "../utils/token";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ error: "Please login." });
  }

  try {
    const data = decodeToken(accessToken);
    const user = await userModel.findById(data.id);
    if (null === user) return res.status(404).json({ error: "User unknown" });
    if (user?.role !== "admin") return res.status(403);
    next();
  } catch (error) {
    return res.status(409).json({ error: "Please login." });
  }
};
