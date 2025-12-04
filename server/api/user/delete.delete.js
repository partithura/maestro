import mongoose from "mongoose";
import User from "~~/server/models/project.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);

  const body = await readBody(event);
  const { _id } = body;
  try {
    const response = await User.findOneAndDelete({ _id: _id });
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
