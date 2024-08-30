import { Schema, model } from "mongoose";

export interface IAdmin {
  name: string;
  email: string;
  password: string;
  image: string;
  role: string;
}

const adminSchema = new Schema<IAdmin>({
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
  image: {
    type: String,
  },
  role: {
    type: String,
    default: "admin",
  },
});

export default model<IAdmin>("admins", adminSchema);
