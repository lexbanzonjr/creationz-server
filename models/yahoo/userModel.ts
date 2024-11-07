import { Schema, model } from "mongoose";
import userModel from "../userModel";
import { RestError } from "../../utils/RestError";

namespace Yahoo {
  export interface IUser {
    userId: String;
    data: Object;
  }

  export const userSchema = new Schema<IUser>({
    userId: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
    },
  }).pre("save", async function (next) {
    const yahooUser = this;
    console.log(yahooUser);
    // make sure the user exist
    if (null === userModel.findById(yahooUser.userId))
      throw new RestError("User does not exist", { status: 400 });
    next();
  });
}

export default model<Yahoo.IUser>("Yahoo.user", Yahoo.userSchema);
