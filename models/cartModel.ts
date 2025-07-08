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

const cartSchema = new Schema<ICart>({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
  ],
});

addExMethods(cartSchema, { listName: "carts" });

export default model<ICart, ExModel<ICart>>("cart", cartSchema);
