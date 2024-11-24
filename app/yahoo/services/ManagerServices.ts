import managerModel, { IManager } from "../models/managerModel";

export class ManagerServices {
  save = async (manager: IManager) => {
    let temp = await managerModel.findOne({ guid: manager.guid });
    if (!temp) {
      temp = new managerModel(manager);
      temp = await temp.save();
    }
    return temp;
  };

  saveList = async (managers: IManager[]) => {
    // Get existing team keys in the database
    const existingManager = await managerModel.find({
      guid: { $in: managers.map((manager) => manager.guid) },
    });
    const existingManagerGuid = new Set(
      existingManager.map((manager) => manager.guid)
    );

    // Filter out duplicates from the new team array
    const uniqueManager = managers.filter(
      (manager) => !existingManagerGuid.has(manager.guid)
    );

    // Insert only unique teams into the database
    if (uniqueManager.length > 0) {
      await managerModel.insertMany(uniqueManager);
    }
  };
}

export default new ManagerServices();
