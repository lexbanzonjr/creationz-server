import jwt, { Secret, sign } from "jsonwebtoken";
import { IAccessTokenData, IGuestTokenData } from "./types";
import { RestError } from "./RestError";

export const createToken = (data: IAccessTokenData | IGuestTokenData) => {
  return sign(data, process.env.SECRET as Secret, { expiresIn: "7d" });
};

export const decodeToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET as Secret) as
    | IAccessTokenData
    | IGuestTokenData;
};

export const refreshToken = (token: string) => {
  const decoded = decodeToken(token);

  const tokenType = decoded.tokenType;
  if (tokenType === "access") {
    const accessToken = decoded as IAccessTokenData;
    return createToken(accessToken);
  } else if (tokenType === "guest") {
    const guestToken = decoded as IGuestTokenData;
    return createToken(guestToken);
  }

  throw new RestError("Invalid token type", { status: 401 });
};
