import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

import { decodeToken } from "../utils/token";

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  res.locals = { populate: req.query.populate };

  const authHeader = req.headers["authorization"];
  if (authHeader) {
    let isExpired = false;

    // Expect "bearer" token in the header
    const authType = authHeader.split(" ")[0];
    if (authType === "Bearer") {
      // Decode the token
      try {
        res.locals.token = authHeader.split(" ")[1];
        res.locals.decodedToken = decodeToken(res.locals.token.split(" ")[1]);
      } catch (error: any) {
        if (error instanceof TokenExpiredError) {
          isExpired = true;
        }
      }
    }

    if (isExpired) {
      res.status(401).send("Token expired");
      return;
    }
  }

  next();
};
