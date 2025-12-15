import { Octokit } from "octokit";
import mongoose from "mongoose";
import ErrorLog from "../../models/error.model";
import Issue from "../../models/issue.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const username = getHeader(event, "username");
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);

  const githubToken = authHeader.substring(7); // Remove "Bearer "

  const octokit = new Octokit({
    auth: githubToken,
  });
  const query = getQuery(event);
  const { project_number, org, item_id } = query;
  const headers = {
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (!project_number || !org) {
    throw createError({
      statusCode: 400,
      message: "Organização e número do projeto são obrigatórios.",
    });
  }
  try {
    const response = await octokit.request(
      `GET /orgs/{org}/projectsV2/{project_number}/items/{item_id}`,
      {
        project_number: project_number,
        org: org,
        item_id: item_id,
        headers: headers,
      }
    );
    const mongoResponse = await Issue.find();

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    if (mongoResponse.errors) {
      throw new Error(mongoResponse.errors[0].message);
    }

    const issues = response.data;
    const responseHeaders = response.headers;

    return {
      issue: issues,
      headers: responseHeaders,
    };
  } catch (error) {
    console.error(error);
    const newError = new ErrorLog({
      apiEndpoint: "gitIssues/post",
      gitEndpoint: "/orgs/{org}/projectsV2/{project_number}/items/{item_id}",
      method: "GET",
      requestParams: params,
      errorMessage: error.message,
      errorDetails: error,
      username: username, // Optional
    });
    await newError.save(); // Salvar a nova issue no banco
    throw createError({
      statusCode: 500,
      message: `Falha ao buscar issues do GitHub via REST: ${error}`,
    });
  }
});
