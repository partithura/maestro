import mongoose from "mongoose";
import Issue from "~~/server/models/issue.model";
import { Octokit } from "octokit";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING)

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
  try {
    const isAuthenticated = await octokit.request("GET /user", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const { issueId } = getQuery(event);
    if (isAuthenticated) {
      try {
        const existingIssue = await Issue.findOne({ id: issueId });
        return existingIssue;
      } catch (error) {
        return `Não foi possível executar a operação: ${error.message}`;
      }
    }
  } catch (e) {
    return `Erro na validação: ${e}`;
  }
});
