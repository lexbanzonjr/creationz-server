import { Schema, model } from "mongoose";
import { IPlayer, playerSchema } from "./playerModel";

export interface ITeam {
  team_key: String;
  team_id: String;
  name: String;
  roster: IPlayer[];
}

export const teamSchema = new Schema<ITeam>({
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
  roster: [playerSchema],
});

export default model<ITeam>("Yahoo.Fantasy.team", teamSchema);
