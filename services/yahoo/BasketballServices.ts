import axios from "axios";
import { parseStringPromise } from "xml2js";

export interface Player {
  player_key: string;
  name: string;
  status: string[];
  primary_position: string;
  positions: string[];
}

export interface Team {
  team_key: string;
  team_id: string;
  name: string;
}

export type RankingStatus =
  | "A" /* All players */
  | "FA" /* Free Agency */
  | "W"; /* Waiver */

export type SortStatus =
  | "OR" /* Overall Rank – based on all available fantasy points for the season */
  | "AR" /* Actual Rank – based on the most recent data and player performance */
  | "PR"; /*Preseason Rank – Yahoo’s projected rank before the season starts.*/
/* Stat IDs: You can also sort by specific statistics by providing their stat ID. You can refer to 
  Yahoo's API documentation to find the correct stat ID for different categories (e.g., points, rebounds, assists). */

class BasketballServices {
  addDropPlayer = async (params: {
    accessToken: string;
    leagueKey: string;
    teamKey: string;
    playerKeyToAdd: string;
    playerKeyToDrop: string;
  }) => {};

  rankings = async (params: {
    access_token: string;
    league_key?: string;
    sort?: SortStatus;
    start?: number;
    status?: RankingStatus;
  }) => {
    if (params.league_key === undefined) throw Error("league_key required");
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${
        params.league_key
      }/players;sort=${params.sort ?? "OR"};status=${
        params.status ?? "FA"
      };start=${params.start ?? 0}`,
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      }
    );

    // xml to json
    const jsonResponse = await parseStringPromise(response.data);
    interface jsonPlayer {}

    // List players
    let players: Player[] = [];
    jsonResponse.fantasy_content.league[0].players[0].player.forEach(
      (player: any, index: number) => {
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

  roster = async (params: { access_token: string; team_key?: string }) => {
    if (params.team_key === undefined) throw Error("team_key required");
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${params.team_key}/roster`,
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      }
    );
    const json: any = await parseStringPromise(response.data);

    // List players
    let players: Player[] = [];
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

  team = async (params: {
    access_token: string;
    team_key?: string;
    name?: string;
  }) => {
    const teams: Team[] = [];
    const response = await axios.get(
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/teams",
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      }
    );

    // xml to json
    const jsonResponse = await parseStringPromise(response.data);
    interface jsonTeam {
      team_key: string[];
      team_id: string[];
      name: string[];
    }
    const jsonTeams: jsonTeam[] =
      jsonResponse.fantasy_content.users[0].user[0].games[0].game[0].teams[0]
        .team;

    // iterate each team from the response
    jsonTeams.forEach((jsoTeams) => {
      const team_key = jsoTeams.team_key[0];
      const name = jsoTeams.name[0];

      // add to the list
      const paramExists = params.team_key || params.name;
      const doesOneParamMatch =
        team_key === params.team_key || name === params.name;
      if (paramExists ? doesOneParamMatch : true) {
        teams.push({
          team_key: jsoTeams.team_key[0],
          team_id: jsoTeams.team_id[0],
          name: jsoTeams.name[0],
        });
      }
    });

    return { teams };
  };
}

export default new BasketballServices();
