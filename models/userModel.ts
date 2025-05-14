import { Schema, Types, model, now } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";
import { IProduct } from "./productModel";

export interface ICart {
  items: {
    product: Types.ObjectId | IProduct;
    quantity: number;
    note?: string;
  }[];
}

export interface IUser extends BaseModel {
  name: string;
  email: string;
  password: string;
  dateCreated: Date;
  lastLogIn: Date;
  roles: string[];
  cart: ICart;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: now,
  },
  lastLogIn: {
    type: Date,
  },
  roles: [
    {
      type: String,
    },
  ],
  cart: {
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
        note: { type: String },
      },
    ],
  },
});

addExMethods(userSchema, { listName: "users" });

export default model<IUser, ExModel<IUser>>("user", userSchema);
