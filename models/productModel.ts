import { Schema, Types, model } from "mongoose";
import { addExMethods, BaseModel, ExModel } from "./mongoose";

export interface IProduct extends BaseModel {
  name: string;
  description: string;
  category_id: Types.ObjectId;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
});

addExMethods(productSchema, { listName: "products" });

export default model<IProduct, ExModel<IProduct>>("product", productSchema);
