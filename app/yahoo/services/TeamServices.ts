import axios from "axios";
import { parseStringPromise } from "xml2js";
import teamModel, { ITeam } from "../models/teamModel";
import userModel from "../models/userModel";

class TeamServices {
  get_sync = async (params: {
    access_token: string;
    userId: string;
    league_key: string;
  }) => {
    const teams: ITeam[] = [];
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${params.league_key}/teams`,
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      }
    );

    // xml to json
    const jsonResponse = await parseStringPromise(response.data);
    return { jsonResponse };
  };
}

export default new TeamServices();
