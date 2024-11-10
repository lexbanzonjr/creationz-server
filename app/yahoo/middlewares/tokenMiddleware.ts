import { Request, Response } from "express";
import { decodeToken } from "../../../utils/token";
import userModel from "../models/userModel";
import { RestError } from "../../../utils/RestError";
import { now } from "mongoose";

export const tokenMiddleware = async (
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
    const user = await userModel.findOne({ userId: data.id });
    if (null === user) throw new RestError("Please login.", { status: 400 });
    if (new Date() > user.tokenExpire) {
      console.log("token expired, refreshing token");
      return res.redirect(
        "/yahoo/auth/refresh_token?redirect=" + req.originalUrl
      );
    }
    next();
  } catch (error) {
    return res.status(409).json({ error });
  }
};
