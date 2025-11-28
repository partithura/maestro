import mongoose from "mongoose";
import EffortArea from "~~/server/models/effortArea.model";
const config = useRuntimeConfig();

const {
  mongodbURL,
  mongodbPassword,
  mongodbUsername,
  mongodbDatabase,
  mongodbAuthSource,
} = config;

export default defineEventHandler(async (event) => {
  const connectionString = `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbURL}/${mongodbDatabase}?authSource=${mongodbAuthSource}`;
  await mongoose.connect(connectionString);
  const body = await readBody(event);

  try {
    const exists = await EffortArea.exists({ value: body.value });
    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "Módulo não encontrado",
      });
    } else {
      const newEffortArea = EffortArea.findOneAndUpdate(
        {
          value: body.value,
        },
        {
          text: body.text,
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
