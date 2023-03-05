import { Schema as SchemaMongoose, SchemaOptions } from '@nestjs/mongoose';

export const Schema = (options?: SchemaOptions): ClassDecorator =>
  SchemaMongoose({
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
    ...(options || {}),
  });
