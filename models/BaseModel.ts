import { Document, Types } from "mongoose";

export interface BaseModel extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
}
