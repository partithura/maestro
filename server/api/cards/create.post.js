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
  const username = getHeader(event, "username");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Token de autorização ausente ou inválido.",
    });
  }

  if (!username) {
    throw createError({
      statusCode: 401,
      message: "Nome de usuário ausente.",
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

  if (!teamResponse) {
    throw createError({
      statusCode: 401,
      message: "Usuário sem autorização.",
    });
  }
  try {
    const exists = await Card.exists({ value: body.value });
    if (!exists) {
      const newCard = new Card({
        value: body.value,
        minimumValue: body.minimumValue,
        maximumValue: body.maximumValue,
        color: body.color,
      });
      const response = await newCard.save(); // Salvar a nova issue no banco
      return response
    } else {
      throw createError({
        statusCode: 500,
        message: "Já existe uma carta com esse valor",
      });
    }
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`;
  }
});
