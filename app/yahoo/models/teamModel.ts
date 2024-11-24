import { Document, Schema, Types, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";

export interface ITeam extends Document {
  team_key: string;
  team_id: string;
  name: string;
  roster: Types.ObjectId[];
  manager: Types.ObjectId;
  league: Types.ObjectId;
}

const teamSchema = new Schema<ITeam>({
  team_key: {
    type: String,
    index: true,
  },
  team_id: {
    type: String,
    index: true,
  },
  name: {
    type: String,
  },
  roster: [
    {
      type: Schema.Types.ObjectId,
      ref: "Yahoo.Fantasy.player",
    },
  ],
  manager: {
    type: Schema.Types.ObjectId,
    ref: "Yahoo.Fantasy.manager",
  },
  league: {
    type: Schema.Types.ObjectId,
    ref: "Yahoo.Fantasy.league",
  },
});

addExMethods(teamSchema);

export default model<ITeam, ExModel<ITeam>>("Yahoo.Fantasy.team", teamSchema);
