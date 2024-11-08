import axios from "axios";
import { parseStringPromise } from "xml2js";

class FantasyServices {
  league = async (access_token: string, team_name: string) => {
    const response = await axios.get(
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/leagues",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const json: any = await parseStringPromise(response.data);

    const games = json.fantasy_content.users[0].user[0].games[0].game;
    let result;
    games.find((game: any) => {
      if (game.leagues === undefined) return;
      return game.leagues.find((league: any) => {
        if (league.league[0].name[0] === team_name) {
          result = {
            league_key: league.league[0].league_key[0],
            name: league.league[0].name[0],
          };
          return;
        }
      });
    });

    return result;
  };
}

export default new FantasyServices();
