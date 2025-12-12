import mongoose from "mongoose";
import EffortModule from "~~/server/models/effortModule.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  const body = await readBody(event);

  try {
    const exists = await EffortModule.exists({ value: body.value });
    if (!exists) {
      const newEffort = new EffortModule({
        value: body.value,
        text: body.text,
        tooltip: body.tooltip,
        repository: body.repository,
        points: body.points,
      });
      const response = await newEffort.save(); // Salvar a nova issue no banco
      return response;
    } else {
      const response = await EffortModule.findOneAndUpdate(
        {
          value: body.value,
        },
        {
          text: body.text,
          tooltip: body.tooltip,
          repository: body.repository,
          points: body.points,
        }
      );
      return response;
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
