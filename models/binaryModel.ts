import { Schema, Types, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";

export interface IBinary extends BaseModel {
  name: string;
  data: Buffer;
  contentType: string;
}

const binarySchema = new Schema<IBinary>({
  name: {
    type: String,
    require: true,
    index: true,
  },
  data: {
    type: Buffer,
    require: true,
  },
  contentType: {
    type: String,
  },
});

addExMethods(binarySchema, { listName: "binaries" });

export default model<IBinary, ExModel<IBinary>>("binary", binarySchema);
