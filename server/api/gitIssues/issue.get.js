import { Octokit } from "octokit";
import mongoose from "mongoose";
import ErrorLog from "../../models/error.model";
import Issue from "../../models/issue.model";
import { env } from "~~/server/support/env";
import { GET_ISSUE } from "../../utils/querys";

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
  const { issueId } = query;

  try {
    const response = await octokit.graphql(
      GET_ISSUE,
      {
        issueId
      }
    );
    const mongoResponse = await Issue.find();

    if (mongoResponse.errors) {
      throw new Error(mongoResponse.errors[0].message);
    }

    return response;
    // EXEMPLO DE RETORNO
		// "node": {
		// 	"id": "I_kwDOQOV9587e1QBl",
		// 	"title": "abc",
		// 	"body": "lorem ipsum"
		// }

  } catch (error) {
    console.error(error);
    const newError = new ErrorLog({
      apiEndpoint: "gitIssues/post",
      gitEndpoint: "/orgs/{org}/projectsV2/{project_number}/items/{item_id}",
      method: "GET",
      errorMessage: error.message,
      errorDetails: error,
      username: username, // Optional
    });
    await newError.save(); // Salvar a nova issue no banco
    throw createError({
      statusCode: 500,
      message: `Falha ao buscar issues do GitHub via GraphQL: ${error}`,
    });
  }
});
