import { Schema, model, now } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  dateCreated: Date;
  lastLogIn: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: now,
  },
  lastLogIn: {
    type: Date,
  },
});

export default model<IUser>("users", userSchema);
