import { Types } from "mongoose";

export interface ITokenData {
  tokenType: "access" | "guest";
}

export interface IAccessTokenData extends ITokenData {
  userId: Types.ObjectId;
  roles: string[];
}

export interface IGuestTokenData extends ITokenData {
  cartId: Types.ObjectId;
}
