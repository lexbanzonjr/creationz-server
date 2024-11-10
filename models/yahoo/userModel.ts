import mongoose, { Schema, model, now } from "mongoose";
import userModel from "../userModel";
import { RestError } from "../../utils/RestError";
import { ILeague, leagueSchema } from "./leagueModel";

export interface IUser {
  userId: String;
  guid: String;
  token: {
    access_token: String;
    refresh_token: String;
    expires_in: Number;
    token_type: String;
  };
  tokenExpire: Date;
  fantasy: {
    leagues: ILeague[];
    leaguesLastSync: Date;
  };
}

export const userSchema = new Schema<IUser>({
  userId: {
    type: String,
  },
  guid: {
    type: String,
  },
  token: {
    type: Object,
  },
  tokenExpire: {
    type: Date,
  },
  fantasy: {
    leagues: [leagueSchema],
    leaguesLastSync: {
      type: Date,
    },
  },
}).pre("save", async function (next) {
  const yahooUser = this;
  // make sure the user exist
  if (null === userModel.findById(yahooUser.userId))
    throw new RestError("User does not exist", { status: 400 });
  next();
});

export default model<IUser>("Yahoo.user", userSchema);
