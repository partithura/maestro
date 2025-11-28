import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  try {
    const result = await Project.find();
    return result;
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`;
  }
});
