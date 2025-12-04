import mongoose from "mongoose";
import User from "~~/server/models/user.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  const body = await readBody(event);
  const { id, login, name, prefs } = body;
  try {
    const newUser = new User({
      id,
      login,
      name,
      prefs,
    });
    const result = await newUser.save();
    return result;
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`;
  }
});
