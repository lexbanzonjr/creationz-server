import {
  Document,
  Model,
  Schema,
  Types,
  QueryWithHelpers,
  SchemaType,
  model,
} from "mongoose";

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export interface ExModel<T extends Document> extends Model<T> {
  findAndPopulate(query: any, populate: string): Promise<T[]>;
  get(query: any): Promise<T>;
  getIndexes(this: Model<T>): Promise<string[]>;
  getReferencedModels(query: string): Promise<ReferenceModel[]>;
}

export interface BaseModel extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

export interface ReferenceModel {
  path: string;
  model: string;
}

async function findAndPopulate<T extends Document>(
  this: Model<T>,
  query: string,
  populate: string = ""
): Promise<T[]> {
  return await this.find({ query }).populate(populate);
}

async function getIndexes<T extends Document>(
  this: Model<T>
): Promise<string[]> {
  const indexes: string[] = [];
  this.schema.eachPath((path: string, schemaType: SchemaType) => {
    if (schemaType.options?.index) {
      indexes.push(path);
    }
  });
  return indexes;
}

async function getOrThrow<T extends Document>(
  this: Model<T>,
  query: any
): Promise<T> {
  const document = await this.findOne(query);
  if (!document) {
    throw new NotFoundError(
      `Record not found for query: ${JSON.stringify(query)}`
    );
  }
  return document;
}

async function getReferencedModels<T extends Document>(
  this: Model<T>,
  populate: string = "false"
): Promise<ReferenceModel[]> {
  const referencedModels: ReferenceModel[] = [];

  this.schema.eachPath((path: string, schemaType: SchemaType) => {
    let modelName: string;

    if (Array.isArray(schemaType.options.type)) {
      // If ref is an array, add each model in the array
      modelName = schemaType.options.type.find(
        (props: { modelName?: string }) => props.modelName !== undefined
      )?.modelName;
    } else {
      // If ref is a single string, add it directly
      modelName = schemaType.options.type.modelName;
    }

    let shouldAdd = populate === "true";
    if (!shouldAdd) {
      const model = populate.split(",").find((value) => value === modelName);
      shouldAdd = model !== undefined;
    }

    if (modelName !== undefined && shouldAdd) {
      referencedModels.push({ path, model: modelName });
    }
  });

  return referencedModels;
}

export function addExMethods<T extends Document>(schema: Schema<T>) {
  schema.statics.findAndPopulate = findAndPopulate;
  schema.statics.get = getOrThrow;
  schema.statics.getIndexes = getIndexes;
  schema.statics.getReferencedModels = getReferencedModels;
}
