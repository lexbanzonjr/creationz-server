import jwt, { Secret, sign } from "jsonwebtoken";
import { IAccessTokenData, IGuestTokenData } from "./types";
import { RestError } from "./RestError";

export const createToken = (data: IAccessTokenData | IGuestTokenData) => {
  return sign(data, process.env.SECRET as Secret, { expiresIn: "7d" });
};

export const decodeToken = (token: string, verify: boolean) => {
  const decode = jwt.decode(token) as IAccessTokenData | IGuestTokenData;
  if (!decode) {
    console.error("Failed to decode token");
    throw new RestError("Invalid token", { status: 401 });
  }

  if (verify) {
    return jwt.verify(token, process.env.SECRET as Secret) as
      | IAccessTokenData
      | IGuestTokenData;
  } else {
    return decode as IAccessTokenData | IGuestTokenData;
  }
};

export const refreshToken = (token: string) => {
  console.log("Refreshing token...");

  // Decode the token to get the payload and remove iat and exp from the payload
  const { iat, exp, ...payload } = decodeToken(token, false);
  console.log("Payload:", payload);

  const tokenType = payload.tokenType;
  if (tokenType === "access") {
    const data = payload as IAccessTokenData;
    return createToken(data);
  } else if (tokenType === "guest") {
    const data = payload as IGuestTokenData;
    return createToken(data);
  }

  throw new RestError("Invalid token type", { status: 401 });
};
