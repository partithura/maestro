import mongoose from "mongoose";
import EffortModule from "~~/server/models/effortModule.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async () => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  try {
    return EffortModule.find();
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
