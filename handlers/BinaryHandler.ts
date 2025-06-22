import { Request, Response } from "express";
import binaryModel, { IBinary } from "../models/binaryModel";
import BaseHandler from "./BaseHandler";
import { RestError } from "../utils/RestError";
import { sendJsonResponse } from "../utils/response";

class BinaryHandler extends BaseHandler<IBinary> {
  constructor() {
    super({ model: binaryModel });
  }

  async create(req: Request, res: Response, next: any) {
    const model = binaryModel;

    // Create response
    const createResponse = async (doc: any) => {
      const response = { [model.modelName]: doc };

      // Remove data from the response
      delete response[model.modelName]["data"];
      return response;
    };

    if (!req.file) {
      throw new RestError("No file uploaded", { status: 400 });
    }
    const { originalname, mimetype, buffer } = req.file;
    const doc = new model({
      name: originalname,
      contentType: mimetype,
      data: buffer,
    });
    await doc.save();

    try {
      const response = await createResponse(doc);
      console.log(response);
      sendJsonResponse(res, 200, response);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }

  async get(req: Request, res: Response, next: any) {
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

export default new BinaryHandler();
