import { Octokit } from "octokit";
import { LIST_ISSUE_COMMENTS } from "../../utils/querys"
const config = useRuntimeConfig();

const { organizationName } = config;

export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const { repo, issueNumber } = getQuery(event);

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
    const response = await octokit.graphql(
      LIST_ISSUE_COMMENTS,
      {
        owner: organizationName,
        repo,
        issueNumber: Number(issueNumber)
      }
    );
    return response.repository.issue.comments.nodes;
    // EXEMPLO DE RETORNO
    // 		"repository": {
    // 			"issue": {
    // 				"comments": {
    // 					"nodes": [
    // 						{
    // 							"author": {
    // 								"login": "lfelipeDutra",
    // 								"avatarUrl": "https://avatars.githubusercontent.com/u/239580054?v=4"
    // 							},
    // 							"body": "update dnv",
    // 							"id": "IC_kwDOQOV9587dd5Uz"
    // 						}
    // 					]
    // 				}
    // 			}
    // 		}

  } catch (e) {
    return `Erro na validação: ${e}`;
  }
});
