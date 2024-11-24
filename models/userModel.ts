import { Schema, model, now } from "mongoose";
import { addExMethods, BaseModel, ExModel } from "./mongoose";

export interface IUser extends BaseModel {
  name: string;
  email: string;
  password: string;
  dateCreated: Date;
  lastLogIn: Date;
  role: string;
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
  role: {
    type: String,
  },
});

addExMethods(userSchema);

export default model<IUser, ExModel<IUser>>("user", userSchema);
