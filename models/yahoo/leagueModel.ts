import { Schema, model } from "mongoose";

export interface ILeague {
  league_key: String;
  name: String;
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
});

export default model<ILeague>("Yahoo.Fantasy.league", leagueSchema);
