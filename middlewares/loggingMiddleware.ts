import { Request, Response } from "express";
import { decodeToken } from "../utils/token";
import { TokenExpiredError } from "jsonwebtoken";

export const loggingMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const log = {
    request_api: `${req.method} ${req.originalUrl}`,
    request_body: JSON.stringify(req.body),
    // request_headers: JSON.stringify(req.headers),
  };

  console.log(log);
  next();
};
