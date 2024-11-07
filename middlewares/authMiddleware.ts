import { Request, Response } from "express";
import { decodeToken } from "../utils/token";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(409).json({ error: "Please login." });
  }

  try {
    const data = decodeToken(accessToken);

    res.locals = {
      id: data.id,
      role: data.role,
    };
    next();
  } catch (error) {
    return res.status(409).json({ error });
  }
};
