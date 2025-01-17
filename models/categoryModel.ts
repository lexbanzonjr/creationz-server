import { Schema, model } from "mongoose";
import { addExMethods, BaseModel, ExModel } from "./mongoose";

export interface ICategory extends BaseModel {
  name: string;
  description: string;
  designs: {
    name: string;
    type: string;
  }[];
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    require: true,
    index: true,
  },
  description: {
    type: String,
  },
  designs: [
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

addExMethods(categorySchema, { listName: "categories" });

export default model<ICategory, ExModel<ICategory>>("category", categorySchema);
