import jwt, { Secret, sign } from "jsonwebtoken";
import { IAccessTokenData } from "./types";

export const createToken = (data: any) => {
  return sign(data, process.env.SECRET as Secret, { expiresIn: "7d" });
};

export const decodeToken = (accessToken: string) => {
  return jwt.verify(
    accessToken,
    process.env.SECRET as Secret
  ) as IAccessTokenData;
};
