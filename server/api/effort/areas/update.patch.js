import mongoose from "mongoose";
import EffortArea from "~~/server/models/effortArea.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  const body = await readBody(event);

  try {
    const exists = await EffortArea.exists({ value: body.value });
    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "Área não encontrada",
      });
    } else {
      const newEffortArea = EffortArea.findOneAndUpdate(
        {
          value: body.value,
        },
        {
          text: body.text,
          repository: body.repository,
        }
      );
      return newEffortArea;
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
