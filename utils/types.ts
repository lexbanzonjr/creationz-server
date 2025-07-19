import { Types } from "mongoose";

export interface ITokenData {
  iat: number;
  exp: number;
  tokenType: "access" | "guest";
}

export interface IAccessTokenData extends ITokenData {
  tokenType: "access";
  userId: Types.ObjectId;
  roles: string[];
}

export interface IGuestTokenData extends ITokenData {
  tokenType: "guest";
  cartId: Types.ObjectId;
}
