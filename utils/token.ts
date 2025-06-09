import jwt, { Secret, sign } from "jsonwebtoken";
import { IAccessTokenData } from "./types";
import { RestError } from "./RestError";

export const createToken = (data: IAccessTokenData) => {
  return sign(data, process.env.SECRET as Secret, { expiresIn: "7d" });
};

export const decodeToken = (accessToken: string, throwOnError: boolean) => {
  try {
    return jwt.verify(
      accessToken,
      process.env.SECRET as Secret
    ) as IAccessTokenData;
  } catch (error) {
    if (throwOnError) {
      throw new RestError("Invalid token", { status: 401 });
    }
    return null;
  }
};
