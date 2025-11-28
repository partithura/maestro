import mongoose from "mongoose";
import Card from "~~/server/models/card.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  const body = await readBody(event);

  try {
    const exists = await Card.exists({ value: body.value });
    if (!exists) {
      const newCard = new Card({
        value: body.value,
        minimumValue: body.minimumValue,
        maximumValue: body.maximumValue,
        tooltip: body.tooltip, //Colocar a descrição do valor da carta
        color: body.color,
      });
      const response = await newCard.save(); // Salvar a nova issue no banco
      return response;
    } else {
      throw createError({
        statusCode: 500,
        message: "Já existe uma carta com esse valor",
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
