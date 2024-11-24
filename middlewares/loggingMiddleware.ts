import { Request, Response } from "express";
import { decodeToken } from "../utils/token";
import userModel from "../models/userModel";

export const loggingMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { accessToken } = req.cookies;

  if (accessToken) {
    try {
      const data = decodeToken(accessToken);

      const user = await userModel.findById(data.id);
      const username = user?.name ?? "unknown";

      const log = {
        username,
        request_api: `${req.method} ${req.originalUrl}`,
        request_body: JSON.stringify(req.body),
      };

      console.log(log);
    } catch (error) {
      return res.status(409).json({ error });
    }
  }
  next();
};
