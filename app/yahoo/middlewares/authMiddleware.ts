import { Request, Response } from "express";
import { decodeToken } from "../utils/token";
import { Locals } from "./types";
import userModel from "../models/userModel";
import { RestError } from "../utils/RestError";
import { getToken } from "./../utils/token";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  if (!req.url.includes("/auth/")) {
    const yahooToken = getToken(req);
    const data = decodeToken(yahooToken);
    const user = await userModel.findById(data.id);
    if (null === user) {
      throw new RestError("Yahoo user not found", { status: 400 });
    }
    (res.locals as Locals).userId = data.id;
  }
  next();
};
