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
      const newEffort = new EffortArea({
        value: body.value,
        text: body.text,
      });
      const response = await newEffort.save(); // Salvar a nova issue no banco
      return response;
    } else {
      const response = await EffortArea.findOneAndUpdate(
        {
          value: body.value,
        },
        {
          text: body.text,
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
