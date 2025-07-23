import { Schema, Types, model, now } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";
import { ICart } from "./cartModel";

export interface IUser extends BaseModel {
  name: string;
  email: string;
  password: string;
  dateCreated: Date;
  lastLogIn: Date;
  roles: string[];
  cart: Types.ObjectId | ICart;
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
    select: false,
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
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
});

addExMethods(userSchema, { listName: "users" });

export default model<IUser, ExModel<IUser>>("user", userSchema);
