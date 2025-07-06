import { Types } from "mongoose";

export interface ITokenData {
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
