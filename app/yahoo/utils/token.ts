import jwt, { Secret, sign } from "jsonwebtoken";
import { IAccessTokenData } from "./types";
import { Request } from "express";
import { RestError } from "./RestError";

export const createToken = (data: IAccessTokenData) => {
  return sign(data, process.env.SECRET as Secret, { expiresIn: "7d" });
};

export const decodeToken = (accessToken: string) => {
  return jwt.verify(
    accessToken,
    process.env.SECRET as Secret
  ) as IAccessTokenData;
};

export const getToken = (req: Request) => {
  let token: string;
  const authHeader = req.headers.authorization as string;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7, authHeader.length);
  } else {
    token = req.cookies.yahooToken;
  }

  if (token.length === 0)
    throw new RestError("Token not found", { status: 400 });

  return token;
};
