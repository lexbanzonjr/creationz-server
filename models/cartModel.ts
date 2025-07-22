import { Schema, Types, model } from "mongoose";

import { BaseModel } from "./BaseModel";
import { addExMethods, ExModel } from "./mongoose";
import { IProduct } from "./productModel";

export interface ICartItem {
  _id?: Types.ObjectId;
  product: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart extends BaseModel {
  items: ICartItem[];
}

const cartProductSchema = new Schema({
  product: { type: Schema.Types.Mixed, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
  items: [cartProductSchema],
});

addExMethods(cartSchema, { listName: "carts" });

export default model<ICart, ExModel<ICart>>("cart", cartSchema);
