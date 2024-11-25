import { Schema, model } from "mongoose";
import { addExMethods, BaseModel, ExModel } from "./mongoose";

export interface ICategory extends BaseModel {
  name: string;
  properties: {
    name: string;
    type: string;
  }[];
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    require: true,
  },
  properties: [
    {
      name: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  ],
});

addExMethods(categorySchema);

export default model<ICategory, ExModel<ICategory>>("category", categorySchema);
