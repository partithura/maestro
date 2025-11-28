import { Octokit } from "octokit";
import mongoose from "mongoose";
import ErrorLog from "../../models/error.model"

const config = useRuntimeConfig();
const {
  mongodbURL,
  mongodbPassword,
  mongodbUsername,
  mongodbDatabase,
  mongodbAuthSource,
} = config;
export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const username = getHeader(event, "username");
  const connectionString = `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbURL}/${mongodbDatabase}?authSource=${mongodbAuthSource}`;
  await mongoose.connect(connectionString);

  const githubToken = authHeader.substring(7); // Remove "Bearer "

  const octokit = new Octokit({
    auth: githubToken,
  });

  const body = await readBody(event);
  const {
    projectNumber,
    org,
    itemId,
    q = "",
    paginationSize = 10,
    after,
    before,
  } = body;
  const headers = {
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (!projectNumber || !org) {
    throw createError({
      statusCode: 400,
      message: "Organização e número do projeto são obrigatórios.",
    });
  }
  try {
    const response = await octokit.request(
      `GET /orgs/{org}/projectsV2/{project_number}/items`,
      {
        project_number: projectNumber,
        org: org,
        itemId: itemId,
        headers: headers,
        q: q,
        per_page: paginationSize,
        after,
        before,
      }
    );

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    const issues = response.data;
    const responseHeaders = response.headers;

    return {
      issues: issues,
      headers: responseHeaders,
    };
  } catch (error) {
    console.error("Falha em github.post");
    console.warn("Error: ", error);
    const newError = new ErrorLog({
      apiEndpoint: 'gitIssues/post',
      gitEndpoint: '/orgs/{org}/projectsV2/{project_number}/items',
      method: "GET",
      requestBody: body,
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
