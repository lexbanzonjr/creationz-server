import axios from "axios";
import { parseStringPromise } from "xml2js";
import { ITeam } from "../models/teamModel";
import ManagerServices from "./ManagerServices";
import leagueModel from "../models/leagueModel";

export class TeamServices {
  sync = async (params: {
    access_token: string;
    userId: string;
    league_key: string;
  }) => {
    const leagueRecord = await leagueModel.get({
      league_key: params.league_key,
    });
    const teams: ITeam[] = [];
    let team: ITeam | undefined;
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
    interface jsonTeam {
      name: string;
      team_key: string;
      team_id: string;
      managers: jsonManager[];
    }
    interface jsonManager {
      manager: jsonManagerDetails[];
    }
    interface jsonManagerDetails {
      guid: string;
      nickname: string;
      email: string;
    }
    const jsonTeams: jsonTeam[] =
      jsonResponse.fantasy_content.league[0].teams[0].team;
    for (const jsonTeam of jsonTeams) {
      const name = jsonTeam.name[0];
      const team_key = jsonTeam.team_key[0];
      const team_id = jsonTeam.team_id[0];

      const jsonManagers: jsonManager[] = jsonTeam.managers;
      let nickname;
      let guid;
      let email;
      for (const jsonManager of jsonManagers) {
        nickname = jsonManager.manager[0].nickname[0];
        guid = jsonManager.manager[0].guid[0];
        email = jsonManager.manager[0].email[0];
      }

      // Save manager
      // let manager;
      // if (nickname !== undefined && guid !== undefined && email !== undefined) {
      //   manager = await ManagerServices.save({ nickname, guid, email });
      // }

      // // Add team to list
      // teams.push({
      //   name,
      //   team_key,
      //   team_id,
      //   roster: [],
      //   manager: manager._id,
      //   league: leagueRecord._id,
      // });
    }

    // Save all teams
    await this.bulkSave(teams);

    return { teams };
  };

  bulkSave = async (teams: ITeam[]) => {
    teams.map((team) => ({
      updateOne: {
        filter: {},
      },
    }));
  };
}

export default new TeamServices();
