import { Model, Schema, Types, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";
import { ICategory } from "./categoryModel";

export interface IProduct extends BaseModel {
  name: string;
  description: string;
  cost: number;
  categories: Types.ObjectId[] | ICategory[];
  image_id?: Types.ObjectId[];
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    require: true,
    index: true,
  },
  cost: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
  },
  categories: [
    {
      type: Schema.Types.Mixed,
      ref: "category",
    },
  ],
  image_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "binary",
    },
  ],
});

addExMethods(productSchema, { listName: "products" });

export default model<IProduct, ExModel<IProduct>>("product", productSchema);
