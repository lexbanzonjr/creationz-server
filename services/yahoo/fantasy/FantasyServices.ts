import axios from "axios";
import { parseStringPromise } from "xml2js";

export interface League {
  league_key: string;
  name: string;
}
class FantasyServices {
  league = async (params: { access_token: string; name?: string }) => {
    let leagues: League[] = [];
    const response = await axios.get(
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/leagues",
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      }
    );
    const jsonResponse = await parseStringPromise(response.data);
    interface jsonGame {
      leagues?: jsonLeague[];
    }
    interface jsonLeague {
      league: jsonLeagueDetails[];
    }
    interface jsonLeagueDetails {
      league_key: string;
      name: string;
    }
    const jsonGames: jsonGame[] =
      jsonResponse.fantasy_content.users[0].user[0].games[0].game;

    // Loop through each league you've ever been on
    jsonGames.forEach((game) => {
      const jsonLeagues = game.leagues;

      if (jsonLeagues === undefined) return;

      jsonLeagues.forEach((jsonLeague) => {
        const league_key = jsonLeague.league[0].league_key[0];
        const name = jsonLeague.league[0].name[0];

        // add to the list
        const paramExists = params.name;
        const doesOneParamMatch = name === params.name;
        if (paramExists ? doesOneParamMatch : true) {
          leagues.push({ league_key, name });
        }
      });
    });

    return { leagues };
  };
}

export default new FantasyServices();
