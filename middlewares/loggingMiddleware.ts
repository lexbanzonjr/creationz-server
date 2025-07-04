import { Request, Response } from "express";
import { decodeToken } from "../utils/token";
import { TokenExpiredError } from "jsonwebtoken";

export const loggingMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    // Extract the Base64 encoded part (after "Basic ")
    try {
      const token = decodeToken(authHeader.split(" ")[1]);
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        res.status(401).send("Token expired");
      }
    }
  }
  const log = {
    request_api: `${req.method} ${req.originalUrl}`,
    request_body: JSON.stringify(req.body),
    // request_headers: JSON.stringify(req.headers),
  };

  console.log(log);
  next();
};
