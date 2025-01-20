import { Schema, Types, model } from "mongoose";
import { addExMethods, BaseModel, ExModel } from "./mongoose";

export interface IProduct extends BaseModel {
  name: string;
  description: string;
  cost: number;
  category_id?: Types.ObjectId;
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
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  image_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "binary",
    },
  ],
});

addExMethods(productSchema, { listName: "products" });

export default model<IProduct, ExModel<IProduct>>("product", productSchema);
