import mongoose from "mongoose";
import EffortArea from "~~/server/models/effortArea.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async () => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  try {
    return EffortArea.find();
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
