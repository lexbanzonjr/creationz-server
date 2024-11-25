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

    if (!authHeader) {
      return res.status(401).send("Missing or invalid Authorization header");
    }

    // Extract the Base64 encoded part (after "Basic ")
    const accessToken = authHeader.split(" ")[1];
    const data = decodeToken(accessToken);
    const user = await userModel.findById(data.id);
    if (null === user) {
      throw new RestError("User not found", { status: 400 });
    }

    (res.locals as BaseLocals).userId = data.id;
  }
  next();
};
