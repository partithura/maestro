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
  const { issue, vote, user } = body;
  //verificar se a issue já está cadastrada. se não estiver, criar a issue
  try {
    const exists = await Issue.exists({ id: issue.id });
    if (!exists) {
      const newIssue = new Issue({
        id: issue.id,
        node_id: issue.node_id,
        project_url: issue.project_url,
        content_type: issue.content_type,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        archived_at: issue.archived_at,
        item_url: issue.item_url,
        votes: [
          {
            user: user,
            vote: vote,
          },
        ],
      });
      await newIssue.save(); // Salvar a nova issue no banco
    } else {
      // A issue existe, verificar se o usuário já votou
      const existingIssue = await Issue.findOne({ id: issue.id });

      const existingVoteIndex = existingIssue.votes.findIndex(
        (v) => v.user.id === user.id
      );

      if (existingVoteIndex > -1) {
        // Usuário já votou, atualizar o voto existente
        existingIssue.votes[existingVoteIndex].vote = vote;
      } else {
        // Usuário ainda não votou, adicionar novo voto
        existingIssue.votes.push({
          user: user,
          vote: vote,
        });
      }

      // Atualizar a issue no banco com os votos modificados
      await Issue.findOneAndUpdate(
        { id: issue.id },
        { $set: { votes: existingIssue.votes } },
        { new: true } // Retorna o documento atualizado
      );
    }
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`
  }
  return 'Criado com sucesso'
});
