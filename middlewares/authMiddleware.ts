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
      const token = authHeader.split(" ")[1];
      const data = decodeToken(token, false);
      if (data) {
        if (data.tokenType === "access") {
          const accessToken = data as IAccessTokenData;
          const user = await userModel.findById(accessToken.userId);
          if (null !== user) {
            (res.locals.auth as AuthLocal) = accessToken;
          }
        }
      }
    }
  }
  next();
};
