import jwt, { Secret, sign } from "jsonwebtoken";
import { IAccessTokenData, IGuestTokenData } from "./types";
import { RestError } from "./RestError";

export const createToken = (data: IAccessTokenData | IGuestTokenData) => {
  return sign(data, process.env.SECRET as Secret, { expiresIn: "7d" });
};

export const decodeToken = (token: string, throwOnError: boolean) => {
  try {
    return jwt.verify(token, process.env.SECRET as Secret) as
      | IAccessTokenData
      | IGuestTokenData;
  } catch (error) {
    if (throwOnError) {
      throw new RestError("Invalid token", { status: 401 });
    }
    return null;
  }
};
