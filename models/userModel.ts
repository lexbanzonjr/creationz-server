import { Schema, Types, model, now } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";

export interface IUser extends BaseModel {
  name: string;
  email: string;
  password: string;
  dateCreated: Date;
  lastLogIn: Date;
  roles: string[];
  cartId: Types.ObjectId;
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
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
});

addExMethods(userSchema, { listName: "users" });

export default model<IUser, ExModel<IUser>>("user", userSchema);
