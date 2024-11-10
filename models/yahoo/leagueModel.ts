import { Schema, model } from "mongoose";
import { ITeam } from "./teamModel";

export interface ILeague {
  league_key: String;
  name: String;
  ended: Boolean;
  team: ITeam;
}

export const leagueSchema = new Schema<ILeague>({
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
});

export default model<ILeague>("Yahoo.Fantasy.league", leagueSchema);
