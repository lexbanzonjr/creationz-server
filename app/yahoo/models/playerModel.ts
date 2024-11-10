import { Schema, model } from "mongoose";

export interface IPlayer {
  player_key: string;
  name: string;
  status: string;
  primary_position: string;
  positions: string;
}

export const playerSchema = new Schema<IPlayer>({
  player_key: { type: String, index: true },
  name: { type: String },
  status: { type: String },
  primary_position: { type: String },
  positions: { type: String },
});

export default model<IPlayer>("Yahoo.Fantasy.player", playerSchema);
