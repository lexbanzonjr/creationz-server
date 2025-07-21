import { Schema, Types, model } from "mongoose";

import { BaseModel } from "./BaseModel";
import { addExMethods, ExModel } from "./mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart extends BaseModel {
  items: ICartItem[];
}

const cartProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
  items: [cartProductSchema],
});

addExMethods(cartSchema, { listName: "carts" });

export default model<ICart, ExModel<ICart>>("cart", cartSchema);
