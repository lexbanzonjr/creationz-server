import { Types } from "mongoose";

export interface IAccessTokenData {
  id: Types.ObjectId;
  roles: string[];
}
