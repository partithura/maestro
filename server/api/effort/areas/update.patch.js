import mongoose from "mongoose";
import EffortArea from "~~/server/models/effortArea.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  const body = await readBody(event);

  try {
    const exists = await EffortArea.exists({ text: body.text });
    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "Área não encontrada",
      });
    } else {
      await EffortArea.findOneAndUpdate(
        {
          text: body.text,
        },
        {
          value: body.value,
          repository: body.repository,
        }
      );
      const response = await EffortArea.find();
    
      return response;
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
