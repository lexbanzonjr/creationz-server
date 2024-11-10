import { Schema, model } from "mongoose";

export interface ITeam {
  team_key: String;
  team_id: String;
  name: String;
}

export const teamSchema = new Schema<ITeam>({
  team_key: {
    type: String,
  },
  team_id: {
    type: String,
  },
  name: {
    type: String,
  },
});

export default model<ITeam>("Yahoo.Fantasy.team", teamSchema);
