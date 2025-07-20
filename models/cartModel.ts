import { Schema, Types, model } from "mongoose";

import { BaseModel } from "./BaseModel";
import { addExMethods, ExModel } from "./mongoose";

export interface ICartProduct {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart extends BaseModel {
  products: ICartProduct[];
}

const cartProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
  products: [cartProductSchema],
});

addExMethods(cartSchema, { listName: "carts" });

export default model<ICart, ExModel<ICart>>("cart", cartSchema);
