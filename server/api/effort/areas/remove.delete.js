import mongoose from "mongoose";
import EffortArea from "~~/server/models/effortArea.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);

  const body = await readBody(event);
  const {value} = body;
  try {
    const deleted = await EffortArea.findOneAndDelete({value:value});
    if (!deleted) {
      throw createError({
        statusCode: 404,
        message: "Área não encontrada",
      });
    }
    
    const response = await EffortArea.find();
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
