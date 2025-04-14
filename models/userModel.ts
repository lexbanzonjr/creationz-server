import { Schema, model, now } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";

export interface IUser extends BaseModel {
  name: string;
  email: string;
  password: string;
  dateCreated: Date;
  lastLogIn: Date;
  roles: string[];
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
});

addExMethods(userSchema, { listName: "users" });

export default model<IUser, ExModel<IUser>>("user", userSchema);
