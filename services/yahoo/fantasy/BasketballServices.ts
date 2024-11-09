import axios from "axios";
import { parseStringPromise } from "xml2js";

class BasketballServices {
  roster = async (params: {
    access_token: string;
    team_key: string | undefined;
  }) => {
    if (params.team_key === undefined) throw Error("team_key undefined");
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${params.team_key}/roster`,
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      }
    );
    const json: any = await parseStringPromise(response.data);

    let players: {
      player_key: string;
      name: string;
      status: string[];
      primary_position: string;
      positions: string[];
    }[] = [];
    json.fantasy_content.team[0].roster[0].players[0].player.forEach(
      (player: any) => {
        players.push({
          player_key: player.player_key[0],
          name: player.name[0].full[0],
          status: player.status,
          primary_position: player.primary_position,
          positions: player.eligible_positions[0].position,
        });
      }
    );

    return { players };
  };

  team = async (params: {access_token: string}) => {
    const response = await axios.get(
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/teams",
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
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
