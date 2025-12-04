import mongoose from "mongoose";
import User from "~~/server/models/user.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  const { id } = getQuery(event);
  try {
    const result = await User.findOne({ id });
    return result;
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`;
  }
});
