import { Request, Response } from "express";
import { decodeToken } from "../utils/token";
import userModel from "../models/userModel";
import { IAccessTokenData } from "../utils/types";

export interface AuthLocal extends IAccessTokenData {}

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
      const data = decodeToken(accessToken, false);
      if (data) {
        const user = await userModel.findById(data.userId);
        if (null !== user) {
          (res.locals.auth as AuthLocal) = data;
        }
      }
    }
  }
  next();
};
