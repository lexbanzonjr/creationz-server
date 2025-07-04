import jwt, { Secret, sign } from "jsonwebtoken";
import { IAccessTokenData, IGuestTokenData } from "./types";

export const createToken = (data: IAccessTokenData | IGuestTokenData) => {
  return sign(data, process.env.SECRET as Secret, { expiresIn: "7d" });
};

export const decodeToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET as Secret) as
    | IAccessTokenData
    | IGuestTokenData;
};
