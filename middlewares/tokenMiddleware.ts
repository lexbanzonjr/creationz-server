import { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { decodeToken } from "../utils/token";

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Token middleware triggered");
  res.locals = { populate: req.query.populate };

  const authHeader = req.headers["authorization"];
  if (!authHeader) return next();

  const [authType, token] = authHeader.split(" ");
  if (authType !== "Bearer" || !token) return next();

  try {
    res.locals.token = token;
    res.locals.decodedToken = decodeToken(token, true);
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error("Token expired:", error.message);
      if (!req.originalUrl.includes("/auth/refresh-token"))
        return res.status(401).send("Token expired");
      console.log("Requested refresh token");
    }
    // Optionally handle other errors here
    return next();
  }
};
