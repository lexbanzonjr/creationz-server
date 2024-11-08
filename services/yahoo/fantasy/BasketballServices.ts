import axios from "axios";
import { parseStringPromise } from "xml2js";

class BasketballServices {
  roster = async (access_token: string, team_key: string) => {
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${team_key}/roster`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return await parseStringPromise(response.data);
  };

  team = async (access_token: string) => {
    const response = await axios.get(
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/teams",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const json = await parseStringPromise(response.data);
    return {
      team_key:
        json.fantasy_content.users[0].user[0].games[0].game[0].teams[0].team[0]
          .team_key[0],
    };
  };
}

export default new BasketballServices();
