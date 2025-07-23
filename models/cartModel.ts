import { Schema, Types, model } from "mongoose";

import { BaseModel } from "./BaseModel";
import { addExMethods, ExModel } from "./mongoose";
import { IProduct } from "./productModel";
import { IOrder } from "./orderModel";

export interface ICartItem {
  _id?: Types.ObjectId;
  product: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart extends BaseModel {
  items: ICartItem[];
  order?: Types.ObjectId | IOrder;
}

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "product", required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
  items: [cartItemSchema],
  order: { type: Schema.Types.ObjectId, ref: "order" },
});

addExMethods(cartSchema, { listName: "carts" });

export default model<ICart, ExModel<ICart>>("cart", cartSchema);
