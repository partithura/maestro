import mongoose from "mongoose";
import Issue from "~~/server/models/issue.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);

  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Token de autorização ausente ou inválido.",
    });
  }

  const githubToken = authHeader.substring(7); // Remove "Bearer "

  if (!githubToken) {
    throw createError({
      statusCode: 401,
      message: "Token do GitHub ausente.",
    });
  }

  const body = await readBody(event);
  const { issue } = body;
  //verificar se a issue já está cadastrada. se não estiver, criar a issue
  try {
    const exists = await Issue.exists({ id: issue.id });
    if (!exists) {
      throw createError({
        status: 404,
        message: "Issue não encontrada no banco local",
      });
    } else {
      // Atualizar a issue no banco com os votos modificados
      const result = await Issue.findOneAndUpdate(
        { id: issue.id },
        { show_votes: !exists.show_votes }
      );
      return result;
    }
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`;
  }
});
