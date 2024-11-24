import { Schema, Types, model } from "mongoose";
import { addExMethods, BaseModel, ExModel } from "./mongoose";

export interface IUser extends BaseModel {
  guid: string;
  bearer: string;
  lastLogIn: Date;
  apiToken: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    expries: Date;
  };
  tokenExpire: Date;
  manager: Types.ObjectId;
  fantasy: {
    leagues: Types.ObjectId[];
    leaguesLastSync: Date;
  };
  lastSync: Date;
}

export const userSchema = new Schema<IUser>({
  guid: { type: String },
  bearer: { type: String },
  lastLogIn: {
    type: Date,
  },
  apiToken: {
    access_token: { type: String },
    refresh_token: { type: String },
    expires_in: { type: Number },
    token_type: { type: String },
    expries: Date,
  },
  tokenExpire: {
    type: Date,
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: "Yahoo.Fantasy.manager",
  },
  fantasy: {
    leagues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Yahoo.Fantasy.league",
      },
    ],
  },
});

addExMethods(userSchema);

export default model<IUser, ExModel<IUser>>("Yahoo.user", userSchema);
