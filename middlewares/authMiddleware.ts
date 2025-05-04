import { Request, Response } from "express";
import { decodeToken } from "../utils/token";
import { BaseLocals } from "./types";
import userModel from "../models/userModel";
import { RestError } from "../utils/RestError";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  if (!req.url.includes("/auth/")) {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      // Extract the Base64 encoded part (after "Basic ")
      const accessToken = authHeader.split(" ")[1];
      const data = decodeToken(accessToken);
      const user = await userModel.findById(data.userId);
      if (null !== user) {
        (res.locals as BaseLocals).userId = data.id;
      }
    }
  }
  next();
};
