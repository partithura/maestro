import mongoose from "mongoose";
import User from "~~/server/models/user.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  const body = await readBody(event);
  const { telegramId, id } = body;

  try {
    const exists = await User.exists({ id: id });
    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "Usuário não encontrado",
      });
    } else {
      const updatedUser = await User.findOneAndUpdate(
        {
          id: id,
        },
        {
          telegramId: telegramId,
        }
      );
      let url = "https://e354a4fda315.ngrok-free.app/api/v1/clean";

      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"service":"TELEGRAM","to":"${telegramId}","message":"Sua inscrição foi feita com sucesso, ${updatedUser.name}. Você vai receber as atualizaçoes do Maestro automaticamente."}`,
      };

      $fetch(url, options);

      return updatedUser;
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
