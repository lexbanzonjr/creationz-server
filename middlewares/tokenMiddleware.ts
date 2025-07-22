import { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { decodeToken } from "../utils/token";
import { sendJsonResponse } from "../utils/response";

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals = { populate: req.query.populate };

  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return sendJsonResponse(res, 401, {
      error: "No authorization header provided",
    });

  const [authType, token] = authHeader.split(" ");
  if (authType !== "Bearer" || !token)
    return sendJsonResponse(res, 401, {
      error: "Invalid authorization format",
    });

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
