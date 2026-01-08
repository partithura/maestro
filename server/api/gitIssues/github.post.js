import { Octokit } from "octokit";
import mongoose from "mongoose";
import ErrorLog from "../../models/error.model";
import Issue from "../../models/issue.model";
import { env } from "~~/server/support/env";
import { triggerSSEEvent } from "../../utils/sse";
import { LIST_PROJECT_ISSUES } from "../../utils/querys";

export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const username = getHeader(event, "username");
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);

  const githubToken = authHeader.substring(7); // Remove "Bearer "

  const octokit = new Octokit({
    auth: githubToken,
  });

  const body = await readBody(event);
  const {
    projectNumber,
    org,
    q = "",
    paginationSize = 10,
    after
  } = body;


  if (!projectNumber || !org) {
    throw createError({
      statusCode: 400,
      message: "Organização e número do projeto são obrigatórios.",
    });
  }
  try {
    const response = await octokit.graphql(
      LIST_PROJECT_ISSUES,
      {
        projectNumber,
        org,
        paginationSize,
        after
      }
    );
    const mongoResponse = await Issue.find();
    await triggerSSEEvent("sse:data-update", {
      message: new Date().toLocaleString(),
      details: body,
    });

    if (mongoResponse.errors) {
      throw new Error(mongoResponse.errors[0].message);
    }

    const issues = response;
    // EXEMPLO DE RETORNO
		// "organization": {
		// 	"projectV2": {
		// 		"id": "PVT_kwDOBhlNGs4BKpQd",
		// 		"items": {
		// 			"nodes": [
		// 				{
		// 					"id": "PVTI_lADOBhlNGs4BKpQdzgisqco",
		// 					"content": {
		// 						"id": "I_kwDOQOV9587e1QBl",
		// 						"number": 13,
		// 						"title": "abc",
		// 						"body": "lorem ipsum",
		// 						"state": "OPEN",
		// 						"url": "https://github.com/partithura-estagiarios/escala-de-estagiarios/issues/13",
		// 						"createdAt": "2025-12-17T11:28:58Z",
		// 						"updatedAt": "2026-01-07T17:17:11Z",
		// 						"author": {
		// 							"avatarUrl": "https://avatars.githubusercontent.com/u/239580054?v=4",
		// 							"login": "lfelipeDutra"
		// 						},
		// 						"repository": {
		// 							"name": "escala-de-estagiarios",
		// 							"owner": {
		// 								"login": "partithura-estagiarios"
		// 							}
		// 						},
		// 						"issueType": {
		// 							"color": "RED",
		// 							"description": "An unexpected problem or behavior",
		// 							"name": "Bug"
		// 						},
		// 						"labels": {
		// 							"nodes": [
		// 								{
		// 									"color": "d73a4a",
		// 									"description": "Something isn't working",
		// 									"id": "LA_kwDOQOV9588AAAACOsRMLA",
		// 									"name": "bug"
		// 								},
		// 								{
		// 									"color": "0075ca",
		// 									"description": "Improvements or additions to documentation",
		// 									"id": "LA_kwDOQOV9588AAAACOsRMNQ",
		// 									"name": "documentation"
		// 								},
		// 								{
		// 									"color": "cfd3d7",
		// 									"description": "This issue or pull request already exists",
		// 									"id": "LA_kwDOQOV9588AAAACOsRMOA",
		// 									"name": "duplicate"
		// 								}
		// 							]
		// 						},
		// 						"assignees": {
		// 							"nodes": [
		// 								{
		// 									"avatarUrl": "https://avatars.githubusercontent.com/u/239580054?v=4",
		// 									"name": "Luiz Felipe",
		// 									"login": "lfelipeDutra"
		// 								}
		// 							]
		// 						},
		// 						"milestone": null
		// 					}
		// 				}
		// 			],
		// 			"pageInfo": {
		// 				"hasNextPage": true,
		// 				"endCursor": "Y3Vyc29yOnYyOpKqMDAwMDAwMDEuMM4IrKnK"
		// 			}
		// 		}
		// 	}
		// }

    return {
      issues: issues,
      mongo: mongoResponse,
    };
  } catch (error) {
    console.error(error);
    const newError = new ErrorLog({
      apiEndpoint: "gitIssues/post",
      gitEndpoint: "/orgs/{org}/projectsV2/{project_number}/items",
      method: "GET",
      requestBody: body,
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
