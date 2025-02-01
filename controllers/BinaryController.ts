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
}

export default new BinaryController();
