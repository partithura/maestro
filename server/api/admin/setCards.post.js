import { Octokit } from "octokit";
import mongoose from "mongoose";
import Card from "~~/server/models/card.model";
const config = useRuntimeConfig();

const { mongodbURL, mongodbPassword, mongodbUsername, mongodbDatabase, mongodbAuthSource} = config;

const ADMIN_TEAM_NAME = config.adminTeamName;
const ORGANIZATION_NAME = config.organizationName;

export default defineEventHandler(async (event) => {
  const connectionString = `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbURL}/${mongodbDatabase}?authSource=${mongodbAuthSource}`;
  await mongoose.connect(connectionString);
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
  const octokit = new Octokit({
    auth: githubToken,
  });
  let teamResponse;
  const body = await readBody(event);
  const { username, card } = body;
  try {
    teamResponse = await octokit.request(
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}",
      {
        username: username,
        team_slug: ADMIN_TEAM_NAME,
        org: ORGANIZATION_NAME,
      }
    );
  } catch (groupError) {
    console.log("GroupError:", groupError);
    teamResponse = false;
  }

  if (!username) {
    throw createError({
      statusCode: 400,
      message: "Nome de usuário é um campo obrigatório.",
    });
  }
  if (!teamResponse) {
    throw createError({
      statusCode: 401,
      message: "Usuário sem autorização.",
    });
  }
  try {
    const exists = await Card.exists({ value: card.value });
    if (!exists) {
      const newCard = new Card({
        value: card.value,
        minimum: card.minimum,
        maximum: card.maximum,
        color: card.color,
      });
      await newCard.save(); // Salvar a nova issue no banco
    } else {
      // Atualizar a issue no banco com os votos modificados
      await Card.findOneAndUpdate(
        { value: card.value },
        {
          $set: {
            minimum: card.minimum,
            maximum: card.maximum,
            color: card.color,
          },
        },
        { new: true } // Retorna o documento atualizado
      );
    }
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`;
  }
});
