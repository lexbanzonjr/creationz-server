import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { IAccessTokenData } from "../utils/types";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(409).json({ error: "Please login." });
  } else {
    try {
      const decodeToken = jwt.verify(
        accessToken,
        process.env.SECRET as Secret
      ) as IAccessTokenData;
      console.log(decodeToken);
      res.locals = {
        id: decodeToken.id,
        role: decodeToken.role,
      };
      next();
    } catch (error) {
      return res.status(409).json({ error: "Please login." });
    }
  }
};
