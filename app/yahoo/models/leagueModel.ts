import { Document, Schema, Types, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";

export interface ILeague extends Document {
  league_key: String;
  name: String;
  ended: Boolean;
  team: Types.ObjectId;
}

const leagueSchema = new Schema<ILeague>({
  league_key: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ended: {
    type: Boolean,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "Yahoo.Fantasy.team",
  },
});

addExMethods(leagueSchema);

export default model<ILeague, ExModel<ILeague>>(
  "Yahoo.Fantasy.league",
  leagueSchema
);
