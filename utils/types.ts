import { Types } from "mongoose";

export interface IAccessTokenData {
  userId: Types.ObjectId;
  roles: string[];
}
