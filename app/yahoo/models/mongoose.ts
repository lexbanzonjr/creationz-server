import { Document, Model, Schema, Types } from "mongoose";

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export interface ExModel<T extends Document> extends Model<T> {
  get(query: any): Promise<T>;
}

export interface BaseModel extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

async function getOrThrow<T extends Document>(
  this: Model<T>,
  query: any
): Promise<T> {
  const document = await this.findOne(query);
  if (!document) {
    throw new NotFoundError(
      `Yahoo: Record not found for query: ${JSON.stringify(query)}`
    );
  }
  return document;
}

export function addExMethods<T extends Document>(schema: Schema<T>) {
  schema.statics.get = getOrThrow;
}
