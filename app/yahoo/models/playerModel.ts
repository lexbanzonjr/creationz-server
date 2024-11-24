import { Document, Schema, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";

export interface IPlayer extends Document {
  player_key: string;
  name: string;
  status: string;
  primary_position: string;
  positions: string;
}

const playerSchema = new Schema<IPlayer>({
  player_key: { type: String, index: true },
  name: { type: String },
  status: { type: String },
  primary_position: { type: String },
  positions: { type: String },
});

addExMethods(playerSchema);

export default model<IPlayer, ExModel<IPlayer>>(
  "Yahoo.Fantasy.player",
  playerSchema
);
