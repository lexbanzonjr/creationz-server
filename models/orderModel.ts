import { model, Schema, Types } from "mongoose";
import { BaseModel } from "./BaseModel";
import { addExMethods, ExModel } from "./mongoose";
import { IUser } from "./userModel";
import { ICart } from "./cartModel";

export interface IOrder extends BaseModel {
  customer: Types.ObjectId | IUser;
  cart: Types.ObjectId | ICart;
  status: string; // e.g., "pending", "completed", "cancelled"
  orderNumber?: string;
  orderDate?: Date;
}

const orderSchema = new Schema<IOrder>({
  customer: { type: Schema.Types.Mixed, ref: "User", required: true },
  cart: { type: Schema.Types.Mixed, ref: "Cart", required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
});

addExMethods(orderSchema, { listName: "orders" });

export default model<IOrder, ExModel<IOrder>>("order", orderSchema);
