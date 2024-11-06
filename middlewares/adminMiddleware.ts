import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { IAccessTokenData } from "../utils/types";
import userModel from "../models/userModel";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ error: "Please login." });
  } else {
    try {
      const decodeToken = jwt.verify(
        accessToken,
        process.env.SECRET as Secret
      ) as IAccessTokenData;
      const user = await userModel.findById(decodeToken.id);
      if (null === user) return res.status(404).json({ error: "User unknown" });
      if (user?.role !== "admin") return res.status(403);
      next();
    } catch (error) {
      return res.status(409).json({ error: "Please login." });
    }
  }
};
