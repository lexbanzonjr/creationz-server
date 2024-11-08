import { Schema, model, now } from "mongoose";
import userModel from "../userModel";
import { RestError } from "../../utils/RestError";

export interface IUser {
  userId: String;
  token: {
    access_token: String;
    refresh_token: String;
    expires_in: Number;
    token_type: String;
  };
  tokenExpire: Date;
}

export const userSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: Object,
    required: true,
  },
  tokenExpire: {
    type: Date,
  },
}).pre("save", async function (next) {
  const yahooUser = this;
  // make sure the user exist
  if (null === userModel.findById(yahooUser.userId))
    throw new RestError("User does not exist", { status: 400 });
  next();
});

export default model<IUser>("Yahoo.user", userSchema);
