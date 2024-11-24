import { Document, Schema, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";

export interface IManager extends Document {
  nickname: string;
  guid: string;
  email: string;
}

const managerSchema = new Schema<IManager>({
  nickname: { type: String, index: true },
  guid: { type: String, index: true },
  email: { type: String },
});

addExMethods(managerSchema);

export default model<IManager, ExModel<IManager>>(
  "Yahoo.Fantasy.manager",
  managerSchema
);
