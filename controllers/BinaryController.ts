import { Request, Response } from "express";
import binaryModel, { IBinary } from "../models/binaryModel";
import BaseController from "./BaseController";
import { RestError } from "../utils/RestError";

class BinaryController extends BaseController<IBinary> {
  constructor() {
    super({
      model: binaryModel,
      createModelOverride: async (
        req: Request,
        res: Response,
        props: IBinary
      ) => {
        if (!req.file) {
          throw new RestError("No file uploaded", { status: 400 });
        }

        const { originalname, mimetype, buffer } = req.file;
        return new binaryModel({
          name: originalname,
          contentType: mimetype,
          data: buffer,
        });
      },
    });
  }

  async get(req: Request, res: Response, next: any) {
    console.log("xxx");
    const _id = req.params._id;
    if (!_id) {
      throw new RestError('Unknown "_id" param', { status: 400 });
    }
    const binary = await binaryModel.findById(_id);
    if (!binary) {
      throw new RestError(`Unable to find binary ${_id}`, { status: 404 });
    }

    // Set headers
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.set("Content-Type", binary.contentType);
    res.set(
      "Content-Disposition",
      `attachment; filename="${binary.name}"; id="${binary._id}"`
    );
    res.send(binary.data);
  }
}

export default new BinaryController();
