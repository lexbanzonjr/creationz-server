import { Types } from "mongoose";

export interface Locals {
  userId: Types.ObjectId;
  sync: boolean;
}
