import { Schema, Types, model } from "mongoose";
import { addExMethods, BaseModel, ExModel } from "./mongoose";
import { IOption, optionSchemaDef } from "./optionModel";

export interface IType extends BaseModel {
  name: string;
  options: Types.ObjectId[] | IOption[];
}

const typeSchema = new Schema<IType>({
  name: {
    type: String,
    index: true,
  },
  options: [{ ...optionSchemaDef }],
});

addExMethods(typeSchema, { listName: "types" });

export default model<IType, ExModel<IType>>("type", typeSchema);
